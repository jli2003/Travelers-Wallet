
package com.travelerswallet.TravelersWallet;

import okhttp3.OkHttpClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class TravelersWalletApplication {
	private static final OkHttpClient okhttp = new OkHttpClient();

	public static void main(String[] args) {
		SpringApplication.run(TravelersWalletApplication.class, args);
	}

	@Bean
	public OkHttpClient okHttpClient() {
		return okhttp;
	}

}
