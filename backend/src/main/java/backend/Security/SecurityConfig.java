package backend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(new org.springframework.web.filter.OncePerRequestFilter() {
                @Override
                protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, java.io.IOException {
                    if (request.getRequestURI().startsWith("/oauth2/authorization/google")) {
                        String mode = request.getParameter("mode");
                        if (mode != null) {
                            request.getSession().setAttribute("oauth2_mode", mode);
                        }
                    }
                    filterChain.doFilter(request, response);
                }
            }, org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.class)
            .csrf(csrf -> csrf.disable()) // Explicitly disable CSRF to avoid modifying manual login endpoints
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/login", "/users", "/users/**", "/admin/**", "/oauth2/**", "/google-login-success").permitAll()
                .anyRequest().permitAll() // Keep original app unprotected functionally per rules
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2LoginSuccessHandler)
            );

        return http.build();
    }
}
