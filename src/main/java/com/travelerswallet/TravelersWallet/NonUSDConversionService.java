package com.travelerswallet.TravelersWallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class NonUSDConversionService implements ConversionStrategy {
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
            double fromCurrencyRate = exchangeRatesService.getExchangeRate("USD", fromCurrency);
            double valueInUSD = value / fromCurrencyRate;
            exchangeRateCache.addExchangeRate("USD", fromCurrency, fromCurrencyRate);

            double toCurrencyRate = exchangeRatesService.getExchangeRate("USD", toCurrency);
            exchangeRateCache.addExchangeRate("USD", toCurrency, toCurrencyRate);

            double valueInToCurrency = valueInUSD * toCurrencyRate;
            exchangeRateCache.addExchangeRate(fromCurrency, toCurrency, (valueInToCurrency/value) );
            return valueInToCurrency;
        }
    }
}
