package backend.Security;

import backend.Model.UserModel;
import backend.Repository.UserRepository;
import backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
                                            
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        // "sub" is the standard Google unique identifier payload
        String googleId = oAuth2User.getAttribute("sub");

        // Retrieve mode securely (check parameter, then check session as fallback for OAuth redirects)
        String mode = request.getParameter("mode");
        if (mode == null) {
            mode = (String) request.getSession().getAttribute("oauth2_mode");
        }
        if (mode == null) {
            mode = "login"; // Default safe fallback
        }

        UserModel user;

        if ("login".equals(mode)) {
            Optional<UserModel> existingUserByEmail = userRepository.findAllByEmail(email);
            if (existingUserByEmail.isPresent()) {
                user = existingUserByEmail.get();
                // SAFE IMPROVEMENT: Link googleId if null
                if (user.getGoogleId() == null) {
                    user.setGoogleId(googleId);
                    user = userRepository.save(user);
                }
            } else {
                response.sendRedirect("http://localhost:3000/login?error=not_registered");
                return;
            }
        } else if ("register".equals(mode)) {
            Optional<UserModel> existingUserByEmail = userRepository.findAllByEmail(email);
            if (existingUserByEmail.isPresent()) {
                response.sendRedirect("http://localhost:3000/register?error=already_exists");
                return;
            } else {
                user = new UserModel();
                user.setEmail(email);
                user.setName(name);
                user.setPassword("GOOGLE_AUTH");
                user.setGoogleId(googleId);
                user.setRole(UserModel.Role.USER);
                user = userRepository.save(user);
            }
        } else {
            response.sendRedirect("http://localhost:3000/login?error=invalid_mode");
            return;
        }

        sessionService.createSession(user.getId(), request);

        // Construct response redirect to frontend
        String redirectUrl = String.format("http://localhost:3000/google-login-success?userId=%s&role=%s&email=%s",
                user.getId(), user.getRole().toString(), user.getEmail());

        response.sendRedirect(redirectUrl);
    }
}
