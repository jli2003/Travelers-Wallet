package com.travelerswallet.TravelersWallet;

import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExchangeRatesService {
    @Value("${openexchangerates.apikey}")
    private String appID;

    //private final String url = "https://openexchangerates.org/api/convert";

    private final OkHttpClient client;

    public ExchangeRatesService(OkHttpClient client ) {
        this.client = client;
    }


    public double getExchangeRate(String from, String to) throws IOException {
        if (appID == null || appID.isEmpty()) {
            throw new IllegalArgumentException("appID required");
        }

        Request request = new Request.Builder()
                .url("https://openexchangerates.org/api/latest.json?app_id=" + appID + "&base=" + from + "&symbols=" + to)
                .get()
                .addHeader("accept", "application/json")
                .build();

        Call call = client.newCall(request);

        try(Response response = call.execute();) {
            if (!response.isSuccessful()) {
                throw new IOException("Response error: " + response.code());
            }

            String responseBody = response.body().string();
            JSONObject jsonObject = new JSONObject(responseBody);
            JSONObject rates = jsonObject.getJSONObject("rates");

            return rates.getDouble(to);

        } catch (IOException | JSONException e) {
            throw new RuntimeException("Error: cannot get exchange rate", e);
        }

    }

    public List<String> getCurrencies() throws IOException, JSONException {
        List<String> currencies = new ArrayList<>();
        Request request = new Request.Builder()
                .url("https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=" + appID)
                .get()
                .addHeader("accept", "application/json")
                .build();
        Call call = client.newCall(request);

        try(Response response = call.execute();) {
            if (!response.isSuccessful()) {
                throw new IOException("Response error: " + response.code());
            }

            String responseBody = response.body().string();
            JSONObject jsonObject = new JSONObject(responseBody);
            Iterator<String> keys = jsonObject.keys();
            while(keys.hasNext()) {
                String key = keys.next();
                currencies.add(key);
            }

            return currencies;
        }
    }
}


