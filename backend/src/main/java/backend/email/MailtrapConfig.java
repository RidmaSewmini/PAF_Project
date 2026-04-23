package backend.email;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class MailtrapConfig {

    @Value("${MAILTRAP_TOKEN:}")
    private String mailtrapToken;

    @Value("${MAILTRAP_ENDPOINT:https://send.api.mailtrap.io/}")
    private String mailtrapEndpoint;

    @PostConstruct
    public void init() {
        boolean isLoaded = (mailtrapToken != null && !mailtrapToken.trim().isEmpty());
        System.out.println("Mailtrap token loaded: " + isLoaded);
        if (isLoaded) {
            // Masking token for safety
            String maskedToken = mailtrapToken.length() > 4 ? mailtrapToken.substring(0, 4) + "..." : "***";
            System.out.println("Mailtrap token: " + maskedToken);
        } else {
            System.err.println("CRITICAL: MAILTRAP_TOKEN is completely empty!");
        }
    }

    @Bean
    public WebClient mailtrapWebClient() {
        String safeToken = (mailtrapToken != null) ? mailtrapToken.trim() : "";
        String baseUri = (mailtrapEndpoint != null) ? mailtrapEndpoint.trim() : "https://send.api.mailtrap.io";
        if (baseUri.endsWith("/")) {
            baseUri = baseUri.substring(0, baseUri.length() - 1);
        }
        return WebClient.builder()
                .baseUrl(baseUri)
                .defaultHeader("Authorization", "Bearer " + safeToken)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }
}
