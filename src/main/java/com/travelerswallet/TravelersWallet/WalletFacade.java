package com.travelerswallet.TravelersWallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
public class WalletFacade {
    private final BudgetService budgetService;
    private final ExchangeRatesService exchangeRatesService;

    private final USDConversionService usdConversionService;
    private final NonUSDConversionService nonUSDConversionService;

    @Autowired
    public WalletFacade(BudgetService budgetService, ExchangeRatesService exchangeRatesService, USDConversionService usdConversionService, NonUSDConversionService nonUSDConversionService) {
        this.budgetService = budgetService;
        this.exchangeRatesService = exchangeRatesService;
        this.usdConversionService = usdConversionService;
        this.nonUSDConversionService = nonUSDConversionService;
    }

    public void setBudget(Double budget) {
        budgetService.setBudget(budget);
    }

    public Double getBudget() {
        return budgetService.getBudget();
    }

    public void addBudget(Double amount) {
        budgetService.addBudget(amount);
    }

    public void subtractExpense(Double expense) {
        budgetService.subtractBudget(expense);
    }

    public Double convertCurrency(Double value, String fromCurrency, String toCurrency) throws IOException {
        if (fromCurrency.equals("USD")){
            return usdConversionService.convert(value, fromCurrency, toCurrency);
        } else {
            return nonUSDConversionService.convert(value,fromCurrency,toCurrency);
        }
    }

    public List<String> getCurrencies() throws IOException {
       return exchangeRatesService.getCurrencies();
    }

}
