package backend.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private WebClient mailtrapWebClient;

    public void sendEmail(String toEmail, String subject, String htmlContent) {
        Map<String, Object> payload = new HashMap<>();
        
        Map<String, String> to = new HashMap<>();
        to.put("email", toEmail);

        Map<String, String> from = new HashMap<>();
        from.put("email", "hello@demomailtrap.co"); // Mailtrap required
        from.put("name", "EduGear");

        payload.put("to", List.of(to));
        payload.put("from", from);
        payload.put("subject", subject);
        payload.put("html", htmlContent);
        payload.put("category", "Integration Test");

        System.out.println("Mailtrap request payload being sent to: " + toEmail);

        mailtrapWebClient.post()
                .uri("/api/send")
                .bodyValue(payload)
                .exchangeToMono(response -> {
                    System.out.println("Mailtrap API response status: " + response.statusCode());
                    if (response.statusCode().isError()) {
                        return response.bodyToMono(String.class).flatMap(body -> {
                            System.err.println("Mailtrap API Error Body: " + body);
                            return Mono.empty();
                        });
                    }
                    return response.bodyToMono(String.class);
                })
                .onErrorResume(e -> {
                    System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
                    return Mono.empty();
                })
                .subscribe(response -> {
                    if (response != null && !response.isEmpty()) {
                        System.out.println("Email sent successfully to " + toEmail);
                    }
                });
    }

    public void sendVerificationEmail(String email, String verificationCode) {
        String html = EmailTemplates.VERIFICATION_EMAIL_TEMPLATE
                .replace("{verificationCode}", verificationCode);
        sendEmail(email, "Verify Your CampusFlow Account", html);
    }

    public void sendWelcomeEmail(String email, String firstName) {
        String loginUrl = "http://localhost:3000/login";
        String html = EmailTemplates.WELCOME_EMAIL_TEMPLATE
                .replace("{firstName}", firstName)
                .replace("{loginURL}", loginUrl);
        sendEmail(email, "Welcome to CampusFlow!", html);
    }

    public void sendPasswordResetEmail(String email, String resetLink) {
        String html = EmailTemplates.PASSWORD_RESET_REQUEST_TEMPLATE
                .replace("{resetURL}", resetLink);
        sendEmail(email, "Password Reset Request", html);
    }

    public void sendPasswordResetSuccessEmail(String email) {
        sendEmail(email, "Password Reset Successful", EmailTemplates.PASSWORD_RESET_SUCCESS_TEMPLATE);
    }
}
