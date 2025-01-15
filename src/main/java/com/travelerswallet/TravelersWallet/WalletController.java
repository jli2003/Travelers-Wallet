package com.travelerswallet.TravelersWallet;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WalletController {
    private final WalletFacade walletFacade;

    @Autowired
    public WalletController(WalletFacade walletFacade) {
        this.walletFacade = walletFacade;
    }

    @GetMapping("/convert")
    public ResponseEntity<Double> convertCurrency(
            @RequestParam("from_currency") String from_currency,
            @RequestParam("to_currency") String to_currency,
            @RequestParam("value") Double value) {
        try {
            double converted = walletFacade.convertCurrency(value, from_currency, to_currency);
            return ResponseEntity.ok(converted);
        } catch(IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/budget")
    public ResponseEntity<Double> getBudget() {
        Double budget = walletFacade.getBudget();
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/currencies")
    public ResponseEntity<List<String>> getCurrencies() {
        try {
            List<String> currencies = walletFacade.getCurrencies();
            return ResponseEntity.ok(currencies);
        } catch(IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }



    @PutMapping("/budget/subtract")
    public ResponseEntity<?> subtractFromBudget(@RequestBody Map<String, Double> requestBody) {
        Double expense = requestBody.get("expenseCost");
        walletFacade.subtractExpense(expense);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/budget/set")
    public ResponseEntity<?> setBudget(@RequestBody Map<String, Double> requestBody) {
        Double newBudget = requestBody.get("convertedValue");
        walletFacade.setBudget(newBudget);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/budget/add")
    public ResponseEntity<?> addBudget(@RequestParam Double amount) {
        walletFacade.addBudget(amount);
        return ResponseEntity.ok().build();
    }
}
