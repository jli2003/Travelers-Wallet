package com.travelerswallet.TravelersWallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class USDConversionService implements ConversionStrategy {
    @Autowired
    private ExchangeRateCache exchangeRateCache;

    @Autowired
    private ExchangeRatesService exchangeRatesService;

    @Override
    public double convert(double value, String fromCurrency, String toCurrency) throws IOException {
        if (exchangeRateCache.inCache(fromCurrency,toCurrency)) {
            return exchangeRateCache.getExchangeRate(fromCurrency,toCurrency) * value;
        }
        else {
            double exchangeRate = exchangeRatesService.getExchangeRate(fromCurrency, toCurrency);
            exchangeRateCache.addExchangeRate(fromCurrency,toCurrency,exchangeRate);
            return value * exchangeRate;
        }
    }
}

