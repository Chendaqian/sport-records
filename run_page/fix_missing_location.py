"""补全 activities 表中 location_country 为空的记录。

location_country 只在新建记录时计算一次(见 generator/db.py 的
update_or_create_activity), 一旦被 Nominatim 限流就会永久留空,
导致前端城市/省份/国家统计缺失这部分活动。

本脚本按 1 req/s 限速补算, 幂等, 可在 CI 中每次同步后重复执行。
"""

import polyline

from config import SQL_FILE
from generator.db import Activity, init_db, reverse_geocode


def main():
    session = init_db(SQL_FILE)
    try:
        rows = (
            session.query(Activity)
            .filter(
                (Activity.location_country == "")
                | (Activity.location_country.is_(None))
            )
            .order_by(Activity.start_date_local)
            .all()
        )
        print(f"{len(rows)} activities missing location_country")
        if not rows:
            return

        fixed = 0
        for a in rows:
            points = polyline.decode(a.summary_polyline) if a.summary_polyline else []
            if not points:
                print(f"  skip {a.run_id} {a.start_date_local}: no polyline")
                continue
            location = reverse_geocode(points[0][0], points[0][1])
            if location:
                a.location_country = location
                fixed += 1
                print(f"  {a.run_id} {a.start_date_local} -> {location[:60]}")
            else:
                print(f"  FAIL {a.run_id} {a.start_date_local}: 反向地理编码无结果")
        session.commit()
        print(f"fixed {fixed}/{len(rows)}")
    finally:
        session.close()


if __name__ == "__main__":
    main()
