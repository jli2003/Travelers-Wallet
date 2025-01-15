package com.travelerswallet.TravelersWallet;

import ch.qos.logback.classic.Logger;
import okhttp3.Response;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class WalletControllerTest {
    @Autowired
    WalletController walletController;

    @Autowired
    private ExchangeRateCache exchangeRateCache;

    private final String fromCurrency;
    private final String toCurrency;


    //framework uses inversion of control to create an instance of the class
    //

    public WalletControllerTest() {
        this.fromCurrency = "USD";
        this.toCurrency = "EUR";
    }

    @Test
    void convertCurrency() {
        ResponseEntity<Double> response = walletController.convertCurrency(fromCurrency, toCurrency,1.0);
        assertEquals(200, response.getStatusCodeValue());
        //System.out.println(response.getBody().toString());
        assertEquals(0.93, response.getBody(), 0.01);
    }
    @Test
    void setBudget() {
        Map<String, Double> convertedValue = new HashMap<>();
        convertedValue.put("convertedValue", 100.0);

        ResponseEntity<?> response = walletController.setBudget(convertedValue);
        assertEquals(200, response.getStatusCodeValue());

        ResponseEntity<?> addBudgetResponse = walletController.addBudget(100.0);
        assertEquals(200, addBudgetResponse.getStatusCodeValue());



        Map<String, Double> subtractValue = new HashMap<>();
        subtractValue.put("expenseCost", 50.0);
        ResponseEntity<?> subtractBudgetResponse = walletController.subtractFromBudget(subtractValue);
        assertEquals(200, addBudgetResponse.getStatusCodeValue());

        ResponseEntity<Double> budget = walletController.getBudget();
        //System.out.println(budget.getBody().toString());
        assertEquals(200, budget.getStatusCodeValue());
        assertEquals(150.0, budget.getBody());

    }

    @Test
    void confirmCurrencyArray() {
        ResponseEntity<List<String>> response = walletController.getCurrencies();
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("JPY"));
    }

    @Test
    void confirmCache() {
        ResponseEntity<Double> response = walletController.convertCurrency("JPY", toCurrency,1.0);
        assertEquals(200, response.getStatusCodeValue());

        assertTrue(exchangeRateCache.inCache("JPY", toCurrency));
        //System.out.println(exchangeRateCache.getExchangeRate("JPY", toCurrency));
        assertEquals(0.0059, response.getBody(), 0.0001);

        //test to see if the inverse was stored as well
        assertTrue(exchangeRateCache.inCache(toCurrency, "JPY"));
        System.out.println(exchangeRateCache.getExchangeRate(toCurrency, "JPY"));
    }



}
