import mailgun from "mailgun-js";

const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const WEATHER_KEY = process.env.WEATHER_API_KEY;

export async function GET(req, res) {
  const mg = mailgun({apiKey: KEY, domain: DOMAIN});

  const city = 'New York, NY';
  const countryCode = 'US';

  const locationEndpoint = `http://dataservice.accuweather.com/locations/v1/cities/${countryCode}/search`;
  const locationRequest = await fetch(`${locationEndpoint}?q=${encodeURIComponent(city)}&apikey=${WEATHER_KEY}`);
  const locationData = await locationRequest.json();

  const locationKey = locationData[0].Key;
  const forecastEndpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`;
  const forecastRequest = await fetch(`${forecastEndpoint}?apikey=${WEATHER_KEY}`);
  const forecastData = await forecastRequest.json();

  const data = {
    from: 'Weather News <mailgun@VERCEL_CRON_EMAIL>',
    to: 'jawadkhenfer@gmail.com',
    subject: 'Your Daily Weather Report',
    html: `
    <h1>${forecastData?.Headline?.Text}</h1>
    <p>${forecastData?.Headline?.Category}</p>
    <ul>
    <li>Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}</li>
    <li>Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}</li>
    </ul>
    <button>${forecastData?.Headline?.Link}</button>
    `
  };

  mg.messages().send(data, function (error, body) {
    if(error){
      console.log(error);
      res.status(500).send({ message: 'Error in sending email' });
    }
    console.log(body?.message);
  });

  return new Response('Email was sent!', {
    status: 200
  });
}
