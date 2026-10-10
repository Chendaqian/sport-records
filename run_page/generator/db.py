import datetime
import os
import time

import geopy
from geopy.geocoders import Nominatim
from sqlalchemy import Column, Float, Integer, Interval, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


# Nominatim 使用政策要求可识别的 User-Agent, 且请求频率不得超过 1 次/秒。
# 原实现每次进程启动生成 4 字母随机 UA 且完全不限速, 批量同步时必被限流,
# 而 location_country 只在新建记录时算一次, 一旦失败就会永久留空。
NOMINATIM_USER_AGENT = os.getenv(
    "NOMINATIM_UA",
    "running_page (https://github.com/Chendaqian/sport-records)",
)
NOMINATIM_MIN_INTERVAL = 1.1

geopy.geocoders.options.default_user_agent = NOMINATIM_USER_AGENT
# reverse the location (lan, lon) -> location detail
g = Nominatim(user_agent=NOMINATIM_USER_AGENT, timeout=10)

_last_geocode_at = 0.0


def reverse_geocode(lat, lon, retries=2):
    """限速调用 Nominatim 反向地理编码, 失败返回空字符串而不抛异常"""
    global _last_geocode_at
    for attempt in range(retries):
        wait = NOMINATIM_MIN_INTERVAL - (time.time() - _last_geocode_at)
        if wait > 0:
            time.sleep(wait)
        _last_geocode_at = time.time()
        try:
            result = g.reverse(f"{lat}, {lon}", language="zh-CN")
            return str(result) if result else ""
        except Exception as e:
            print(f"reverse geocode {lat},{lon} 第 {attempt + 1}/{retries} 次失败: {e}")
    return ""


ACTIVITY_KEYS = [
    "run_id",
    "name",
    "distance",
    "moving_time",
    "type",
    "start_date",
    "start_date_local",
    "location_country",
    "summary_polyline",
    "average_heartrate",
    "average_speed",
]


class Activity(Base):
    __tablename__ = "activities"

    run_id = Column(Integer, primary_key=True)
    name = Column(String)
    distance = Column(Float)
    moving_time = Column(Interval)
    elapsed_time = Column(Interval)
    type = Column(String)
    start_date = Column(String)
    start_date_local = Column(String)
    location_country = Column(String)
    summary_polyline = Column(String)
    average_heartrate = Column(Float)
    average_speed = Column(Float)
    streak = None

    def to_dict(self):
        out = {}
        for key in ACTIVITY_KEYS:
            attr = getattr(self, key)
            if isinstance(attr, (datetime.timedelta, datetime.datetime)):
                out[key] = str(attr)
            else:
                out[key] = attr

        if self.streak:
            out["streak"] = self.streak

        return out


def update_or_create_activity(session, run_activity):
    created = False
    try:
        activity = (
            session.query(Activity).filter_by(run_id=int(run_activity.id)).first()
        )
        if not activity:
            start_point = run_activity.start_latlng
            location_country = getattr(run_activity, "location_country", "")
            # or China for #176 to fix
            if not location_country and start_point or location_country == "China":
                location_country = reverse_geocode(start_point.lat, start_point.lon)

            activity = Activity(
                run_id=run_activity.id,
                name=run_activity.name,
                distance=run_activity.distance,
                moving_time=run_activity.moving_time,
                elapsed_time=run_activity.elapsed_time,
                type=run_activity.type,
                start_date=run_activity.start_date,
                start_date_local=run_activity.start_date_local,
                location_country=location_country,
                average_heartrate=run_activity.average_heartrate,
                average_speed=float(run_activity.average_speed),
                summary_polyline=(
                    run_activity.map and run_activity.map.summary_polyline or ""
                ),
            )
            session.add(activity)
            created = True
        else:
            activity.name = run_activity.name
            activity.distance = float(run_activity.distance)
            activity.moving_time = run_activity.moving_time
            activity.elapsed_time = run_activity.elapsed_time
            activity.type = run_activity.type
            activity.average_heartrate = run_activity.average_heartrate
            activity.average_speed = float(run_activity.average_speed)
            activity.summary_polyline = (
                run_activity.map and run_activity.map.summary_polyline or ""
            )
    except Exception as e:
        print(f"something wrong with {run_activity.id}")
        print(str(e))

    return created


def init_db(db_path):
    engine = create_engine(
        f"sqlite:///{db_path}", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)
    return session()
