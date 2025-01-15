package com.travelerswallet.TravelersWallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class BudgetService {
    private Double budget;

    public BudgetService() {;
        this.budget = 0.00;
    }

    public Double getBudget() {
        return this.budget;
    }

    public void setBudget(Double newBudget) {
        this.budget = newBudget;
    }

    public void addBudget(Double amount) {
        this.budget += amount;
    }

    public void subtractBudget(Double expense) {
        if (this.budget >= expense) {
            this.budget = this.budget - expense;
        }
        else {
            System.out.println("Budget is lower than expense");
        }
    }
}
