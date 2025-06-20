
package org.example.serviceplatform.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.serviceplatform.Entities.Utilisateur;
import org.example.serviceplatform.Repositories.TokenRepo;
import org.example.serviceplatform.Services.JwtService;
import org.example.serviceplatform.Services.UtilisateurService;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UtilisateurService utilisateurService;
    private final TokenRepo tokenRepo;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        System.out.println("Path requested: " + path);  // Ajoutez ce log
        System.out.println("il arrive ici (shouldNotFilter)");
        // Liste des chemins publics
        return path.equals("/api/client/register") ||
                path.equals("/api/prestataire/register") ||
                path.equals("/api/client/services/all") ||
                path.startsWith("/api/auth/") ||
                path.startsWith("/api/images/");

    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Il arrive ici(doFilterInternal)");

        if (shouldNotFilter(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Utilisateur userDetails = this.utilisateurService.loadUserByUsername(userEmail);
                var isTokenValid = tokenRepo.findByToken(jwt)
                        .map(t -> !t.isExpired() && !t.isRevoked())
                        .orElse(false);

                if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log l'erreur mais ne pas la propager pour éviter de révéler des détails sensibles
            System.err.println("Erreur lors du traitement du token JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
