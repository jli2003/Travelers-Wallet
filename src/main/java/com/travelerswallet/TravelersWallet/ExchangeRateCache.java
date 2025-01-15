package com.travelerswallet.TravelersWallet;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ExchangeRateCache {
    private Map<String, Double> exchangeRates;

    public ExchangeRateCache() {
        this.exchangeRates = new HashMap<>();
    }

    public boolean inCache(String fromCurrency, String toCurrency) {
        String key = fromCurrency + " " + toCurrency;

        if (exchangeRates.containsKey(key)) {
            return true;
        }
        return false;
    }

    public double getExchangeRate(String fromCurrency, String toCurrency){
        String key = fromCurrency + " " + toCurrency;

        return exchangeRates.get(key);
    }

    public void addExchangeRate(String fromCurrency, String toCurrency, double rate) {
        String key = fromCurrency + " " + toCurrency;
        String inverseKey = toCurrency + " " + fromCurrency;
        exchangeRates.put(key, rate);
        exchangeRates.put(inverseKey, 1/rate);
    }


}
