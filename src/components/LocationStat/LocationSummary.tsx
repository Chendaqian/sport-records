import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';

// only support China for now
const LocationSummary = () => {
  const { years, countries, provinces, cities } = useActivities();
  return (
    <div className="_statForType_1nqem_9" id="allDiv">
      <section>
        {years ? <Stat value={`${years.length}`} description=" 年里我走过" /> : null}
        {countries ? <Stat value={countries.length} description=" 个国家" /> : null}
        {provinces ? <Stat value={provinces.length} description=" 个省份" /> : null}
        {cities ? (
          <Stat value={Object.keys(cities).length} description=" 个城市" />
        ) : null}
      </section>
      <hr color='red'/>
    </div>
  );
};

export default LocationSummary;
