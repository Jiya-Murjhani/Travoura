import { useWeather } from '@/hooks/useWeather';
import { usePreferences } from '@/hooks/usePreferences';

const WeatherWidget = () => {
  const { data: preferences } = usePreferences();
  const city = preferences?.home_city ?? null;
  const { data: weather } = useWeather(city);

  if (!city || !weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      background: 'rgba(240,236,228,0.04)',
      border: '0.5px solid rgba(240,236,228,0.1)',
      borderRadius: '4px',
    }}>
      <img
        src={iconUrl}
        alt={weather.description}
        style={{ width: '32px', height: '32px' }}
      />
      <div>
        <div style={{
          fontSize: '18px',
          fontWeight: '400',
          color: '#c9a96e',
          lineHeight: 1,
        }}>
          {weather.temp}°C
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(240,236,228,0.4)',
          textTransform: 'capitalize',
          marginTop: '2px',
        }}>
          {weather.city} · {weather.description}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
