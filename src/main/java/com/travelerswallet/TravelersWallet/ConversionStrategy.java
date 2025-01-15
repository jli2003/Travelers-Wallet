package com.travelerswallet.TravelersWallet;

import java.io.IOException;

public interface ConversionStrategy {
    double convert(double value, String fromCurrency, String toCurrency) throws IOException;
}
