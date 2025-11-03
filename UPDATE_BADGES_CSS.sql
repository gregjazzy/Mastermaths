non tu m ouvre l-- Mise à jour des badges avec leur CSS personnalisé

-- Badge: APPRENTI
UPDATE badges SET "customCSS" = 'body {
            background: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        
        .badge {
            position: relative;
            width: 250px;
            height: 350px;
            border-radius: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 8px #667eea, inset 0 0 60px rgba(255, 255, 255, 0.1);
            overflow: visible;
            animation: card-float 4s ease-in-out infinite, glow-pulse 2s ease-in-out infinite;
        }
        
        /* Logo "Master Maths" premium avec animation d''écriture */
        .badge-brand {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            
            /* Dégradé doré élégant (adouci) */
            background: linear-gradient(135deg, 
                #E8C547 0%,
                #F5E6B3 30%,
                #EDD76E 50%,
                #D4AF37 70%,
                #C9A961 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            /* Contour lumineux subtil */
            filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.6))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            
            /* Animation d''écriture */
            overflow: hidden;
            white-space: nowrap;
            width: 0;
            animation: typewriter 1.5s steps(12) forwards;
            animation-delay: 0.5s;
            opacity: 0;
        }
        
        @keyframes typewriter {
            0% {
                width: 0;
                opacity: 1;
            }
            100% {
                width: 125px;
                opacity: 1;
            }
        }
        
        /* Titre de maîtrise sous le x² */
        .badge-title {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
            
            /* Dégradé doré élégant */
            background: linear-gradient(135deg, 
                #E8C547 0%,
                #F5E6B3 25%,
                #EDD76E 50%,
                #D4AF37 75%,
                #C9A961 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            /* Contour lumineux */
            filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.7))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            
            /* Animation d''apparition après le x² */
            opacity: 0;
            animation: fade-in-title 1s ease-out forwards;
            animation-delay: 2.5s;
        }
        
        @keyframes fade-in-title {
            0% {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        /* Effet de lumière douce + moiré au fond */
        .badge::before {
            content: '''';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(
                    0deg,
                    rgba(255, 255, 255, 0.03) 0px,
                    transparent 2px,
                    transparent 4px,
                    rgba(255, 255, 255, 0.03) 6px
                ),
                repeating-linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.03) 0px,
                    transparent 2px,
                    transparent 4px,
                    rgba(255, 255, 255, 0.03) 6px
                ),
                radial-gradient(
                    ellipse at 50% 50%,
                    rgba(255, 255, 255, 0.05) 0%,
                    transparent 60%
                );
            animation: moire-effect 8s ease-in-out infinite;
            pointer-events: none;
            border-radius: 16px;
        }
        
        @keyframes moire-effect {
            0%, 100% {
                opacity: 0.6;
                transform: rotate(0deg) scale(1);
            }
            50% {
                opacity: 1;
                transform: rotate(2deg) scale(1.02);
            }
        }
        
        /* x² qui zoom depuis 0 - sera défini après les keyframes */
        
        /* Halo lumineux qui apparaît au zoom max */
        .halo {
            position: absolute;
            top: 50%; left: 50%;
            width: 200px;
            height: 200px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, rgba(212, 175, 55, 0) 70%);
            opacity: 0;
            animation: halo-burst 6s ease-in-out forwards;
            z-index: 5;
        }
        
        /* Particules dorées d''explosion */
        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 8px;
            height: 8px;
            background: #D4AF37;
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 8px #D4AF37, 0 0 15px rgba(212, 175, 55, 0.6);
        }
        
        .particle:nth-child(2) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.5s; }
        .particle:nth-child(3) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.55s; }
        .particle:nth-child(4) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.6s; }
        .particle:nth-child(5) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.65s; }
        .particle:nth-child(6) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.7s; }
        .particle:nth-child(7) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.75s; }
        .particle:nth-child(8) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.8s; }
        .particle:nth-child(9) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.85s; }
        
        /* Particules flottantes permanentes */
        .floating-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #D4AF37;
            border-radius: 50%;
            box-shadow: 0 0 6px #D4AF37, 0 0 12px rgba(212, 175, 55, 0.5);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 3s;
        }
        
        .floating-particle:nth-child(10) { 
            top: 20%; left: 15%;
            animation: float-around-1 8s infinite;
        }
        .floating-particle:nth-child(11) { 
            top: 30%; right: 20%;
            animation: float-around-2 10s infinite;
            animation-delay: 3.5s;
        }
        .floating-particle:nth-child(12) { 
            bottom: 25%; left: 20%;
            animation: float-around-3 9s infinite;
            animation-delay: 4s;
        }
        .floating-particle:nth-child(13) { 
            bottom: 35%; right: 15%;
            animation: float-around-4 11s infinite;
            animation-delay: 4.5s;
        }
        .floating-particle:nth-child(14) { 
            top: 50%; left: 10%;
            animation: float-around-5 7s infinite;
            animation-delay: 5s;
        }
        .floating-particle:nth-child(15) { 
            top: 60%; right: 10%;
            animation: float-around-6 9.5s infinite;
            animation-delay: 5.5s;
        }
        
        @keyframes float-around-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(30px, -20px) scale(1.2); opacity: 0.6; }
            50% { transform: translate(50px, 10px) scale(0.8); opacity: 0.4; }
            75% { transform: translate(20px, 30px) scale(1.1); opacity: 0.5; }
        }
        
        @keyframes float-around-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            25% { transform: translate(-40px, 20px) scale(0.9); opacity: 0.6; }
            50% { transform: translate(-20px, -30px) scale(1.3); opacity: 0.5; }
            75% { transform: translate(-35px, 15px) scale(1); opacity: 0.4; }
        }
        
        @keyframes float-around-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            30% { transform: translate(25px, -25px) scale(1.1); opacity: 0.6; }
            60% { transform: translate(45px, -10px) scale(0.9); opacity: 0.5; }
            80% { transform: translate(15px, -20px) scale(1.2); opacity: 0.4; }
        }
        
        @keyframes float-around-4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            20% { transform: translate(-30px, -15px) scale(1.2); opacity: 0.6; }
            50% { transform: translate(-50px, -30px) scale(0.8); opacity: 0.5; }
            80% { transform: translate(-25px, -20px) scale(1.1); opacity: 0.4; }
        }
        
        @keyframes float-around-5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            35% { transform: translate(35px, 20px) scale(1.3); opacity: 0.6; }
            70% { transform: translate(20px, -15px) scale(0.9); opacity: 0.5; }
        }
        
        @keyframes float-around-6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            40% { transform: translate(-35px, 25px) scale(1.1); opacity: 0.6; }
            75% { transform: translate(-15px, -20px) scale(0.8); opacity: 0.5; }
        }
        
        @keyframes card-float {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            25% { transform: translateY(-10px) rotateX(5deg) rotateY(-5deg); }
            50% { transform: translateY(0px) rotateX(0deg) rotateY(5deg); }
            75% { transform: translateY(-10px) rotateX(-5deg) rotateY(0deg); }
        }
        
        
        /* Animation magique : zoom depuis 0 puis reste fixe */
        @keyframes magic-zoom {
            0% { 
                transform: translate(-50%, -50%) scale(0) rotate(0deg); 
                opacity: 0;
                filter: blur(10px);
            }
            25% { 
                transform: translate(-50%, -50%) scale(1.6) rotate(360deg); 
                opacity: 1;
                filter: blur(0px);
            }
            30%, 100% { 
                transform: translate(-50%, -50%) scale(1.6) rotate(360deg); 
                opacity: 1;
                filter: blur(0px);
                text-shadow: 
                    0 0 20px rgba(255, 255, 255, 0.8),
                    0 0 40px rgba(102, 126, 234, 0.6);
            }
        }
        
        /* Effet "bling" subtil et élégant */
        @keyframes coin-shine {
            0%, 23% { 
                filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.6))
                        drop-shadow(0 0 5px rgba(212, 175, 55, 0.4))
                        drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))
                        brightness(1);
            }
            25% { 
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))
                        drop-shadow(0 0 12px rgba(212, 175, 55, 0.7))
                        drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))
                        drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))
                        brightness(1.3);
            }
            27%, 100% { 
                filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.6))
                        drop-shadow(0 0 5px rgba(212, 175, 55, 0.4))
                        drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))
                        brightness(1);
            }
        }
        
        .badge::after {
            content: ''x\00B2'';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 80px;
            font-weight: 900;
            
            /* Dégradé doré élégant (adouci) */
            background: linear-gradient(135deg, 
                #E8C547 0%,
                #F5E6B3 25%,
                #EDD76E 50%,
                #D4AF37 75%,
                #C9A961 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            /* Contour doré subtil */
            filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.6))
                    drop-shadow(0 0 5px rgba(212, 175, 55, 0.4))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
            
            font-family: Georgia, serif;
            animation: 
                magic-zoom 6s ease-in-out forwards,
                coin-shine 6s ease-in-out forwards;
            animation-iteration-count: 1;
            z-index: 10;
        }
        
        /* Halo doré subtil qui pulse au zoom max */
        @keyframes halo-burst {
            0%, 23% { 
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            24.5% { 
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 0.6;
            }
            25% { 
                transform: translate(-50%, -50%) scale(2);
                opacity: 0.8;
            }
            26% { 
                transform: translate(-50%, -50%) scale(2.8);
                opacity: 0.3;
            }
            27% { 
                transform: translate(-50%, -50%) scale(3.2);
                opacity: 0;
            }
            100% { 
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
        }
        
        /* Flash lumineux "bling" subtil */
        .shine-flash {
            position: absolute;
            top: 50%; left: 50%;
            width: 120px;
            height: 120px;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 15;
            pointer-events: none;
        }
        
        /* Rayon diagonal principal */
        .shine-flash::before {
            content: '''';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0) 20%,
                rgba(255, 255, 255, 0.6) 50%, 
                rgba(255, 255, 255, 0) 80%,
                transparent 100%
            );
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
            animation: flash-diagonal-1 6s ease-out forwards;
        }
        
        /* Rayon diagonal secondaire */
        .shine-flash::after {
            content: '''';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0) 20%,
                rgba(255, 255, 255, 0.6) 50%, 
                rgba(255, 255, 255, 0) 80%,
                transparent 100%
            );
            transform: translate(-50%, -50%) rotate(-45deg);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
            animation: flash-diagonal-2 6s ease-out forwards;
        }
        
        @keyframes flash-diagonal-1 {
            0%, 24% {
                opacity: 0;
                width: 80%;
            }
            25% {
                opacity: 0.8;
                width: 250%;
            }
            26% {
                opacity: 0;
                width: 300%;
            }
            100% {
                opacity: 0;
            }
        }
        
        @keyframes flash-diagonal-2 {
            0%, 24% {
                opacity: 0;
                width: 80%;
            }
            25% {
                opacity: 0.8;
                width: 250%;
            }
            26% {
                opacity: 0;
                width: 300%;
            }
            100% {
                opacity: 0;
            }
        }
        
        /* Particules dorées qui explosent */
        @keyframes particle-burst {
            0% {
                transform: translate(-50%, -50%) translate(0, 0) scale(0);
                opacity: 0;
            }
            1% {
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) 
                    translate(
                        calc((100vw / 10) * cos(var(--angle, 0) * 1deg)), 
                        calc((100vw / 10) * sin(var(--angle, 0) * 1deg))
                    ) 
                    scale(1);
                opacity: 0;
            }
        }
        
        .particle:nth-child(2) { --angle: 0; }
        .particle:nth-child(3) { --angle: 45; }
        .particle:nth-child(4) { --angle: 90; }
        .particle:nth-child(5) { --angle: 135; }
        .particle:nth-child(6) { --angle: 180; }
        .particle:nth-child(7) { --angle: 225; }
        .particle:nth-child(8) { --angle: 270; }
        .particle:nth-child(9) { --angle: 315; }
        
        @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 8px #667eea, 0 0 60px rgba(118, 75, 162, 0.6); }
            50% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6), 0 0 0 4px rgba(255, 255, 255, 1), 0 0 0 8px #667eea, 0 0 80px rgba(118, 75, 162, 0.8); }
        }', "useCustomCSS" = true WHERE id = 'badge_seconddegre_apprenti';

-- Badge: CONFIRMÉ
UPDATE badges SET "customCSS" = 'body {
            background: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        
        .badge {
            position: relative;
            width: 250px;
            height: 350px;
            border-radius: 16px;
            background: linear-gradient(135deg, #1e3a8a 0%, #0891b2 50%, #06b6d4 100%);
            box-shadow: 
                0 8px 32px rgba(8, 145, 178, 0.5),
                0 0 0 5px rgba(255, 255, 255, 0.9),
                0 0 0 10px #c0c0c0,
                0 0 0 15px rgba(192, 192, 192, 0.5),
                inset 0 0 60px rgba(255, 255, 255, 0.15);
            overflow: visible;
            animation: card-float 4s ease-in-out infinite, glow-pulse-silver 2s ease-in-out infinite;
        }
        
        /* Logo "Master Maths" premium avec animation d''écriture */
        .badge-brand {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            
            /* Dégradé doré plus brillant */
            background: linear-gradient(135deg, 
                #F4D03F 0%,
                #FFF8DC 30%,
                #F9E79F 50%,
                #E8C547 70%,
                #D4AF37 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            /* Contour lumineux subtil */
            filter: drop-shadow(0 0 3px rgba(244, 208, 63, 0.8))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            
            /* Animation d''écriture */
            overflow: hidden;
            white-space: nowrap;
            width: 0;
            animation: typewriter 1.5s steps(12) forwards;
            animation-delay: 0.5s;
            opacity: 0;
        }
        
        @keyframes typewriter {
            0% { width: 0; opacity: 1; }
            100% { width: 125px; opacity: 1; }
        }
        
        /* Titre de maîtrise */
        .badge-title {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
            
            /* Dégradé doré brillant */
            background: linear-gradient(135deg, 
                #F4D03F 0%,
                #FFF8DC 25%,
                #F9E79F 50%,
                #E8C547 75%,
                #D4AF37 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 4px rgba(244, 208, 63, 0.8))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            opacity: 0;
            animation: fade-in-title 1s ease-out forwards;
            animation-delay: 2.5s;
        }
        
        @keyframes fade-in-title {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* Effet de lumière moiré au fond */
        .badge::before {
            content: '''';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.04) 6px),
                repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.04) 6px),
                radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
            animation: moire-effect 8s ease-in-out infinite;
            pointer-events: none;
            border-radius: 16px;
        }
        
        @keyframes moire-effect {
            0%, 100% { opacity: 0.6; transform: rotate(0deg) scale(1); }
            50% { opacity: 1; transform: rotate(2deg) scale(1.02); }
        }
        
        /* Halo lumineux */
        .halo {
            position: absolute;
            top: 50%; left: 50%;
            width: 200px;
            height: 200px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(244, 208, 63, 0.7) 0%, rgba(244, 208, 63, 0) 70%);
            opacity: 0;
            animation: halo-burst 6s ease-in-out forwards;
            z-index: 5;
        }
        
        /* Particules d''explosion */
        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 8px;
            height: 8px;
            background: #F4D03F;
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 10px #F4D03F, 0 0 18px rgba(244, 208, 63, 0.7);
        }
        
        .particle:nth-child(2) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.5s; }
        .particle:nth-child(3) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.55s; }
        .particle:nth-child(4) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.6s; }
        .particle:nth-child(5) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.65s; }
        .particle:nth-child(6) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.7s; }
        .particle:nth-child(7) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.75s; }
        .particle:nth-child(8) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.8s; }
        .particle:nth-child(9) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.85s; }
        
        /* Particules flottantes */
        .floating-particle {
            position: absolute;
            width: 5px;
            height: 5px;
            background: #F4D03F;
            border-radius: 50%;
            box-shadow: 0 0 10px #F4D03F, 0 0 18px rgba(244, 208, 63, 0.6);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 3s;
        }
        
        .floating-particle:nth-child(10) { top: 20%; left: 15%; animation: float-around-1 8s infinite; }
        .floating-particle:nth-child(11) { top: 30%; right: 20%; animation: float-around-2 10s infinite; animation-delay: 3.5s; }
        .floating-particle:nth-child(12) { bottom: 25%; left: 20%; animation: float-around-3 9s infinite; animation-delay: 4s; }
        .floating-particle:nth-child(13) { bottom: 35%; right: 15%; animation: float-around-4 11s infinite; animation-delay: 4.5s; }
        .floating-particle:nth-child(14) { top: 50%; left: 10%; animation: float-around-5 7s infinite; animation-delay: 5s; }
        .floating-particle:nth-child(15) { top: 60%; right: 10%; animation: float-around-6 9.5s infinite; animation-delay: 5.5s; }
        
        @keyframes float-around-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(30px, -20px) scale(1.2); opacity: 0.6; }
            50% { transform: translate(50px, 10px) scale(0.8); opacity: 0.4; }
            75% { transform: translate(20px, 30px) scale(1.1); opacity: 0.5; }
        }
        
        @keyframes float-around-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            25% { transform: translate(-40px, 20px) scale(0.9); opacity: 0.6; }
            50% { transform: translate(-20px, -30px) scale(1.3); opacity: 0.5; }
            75% { transform: translate(-35px, 15px) scale(1); opacity: 0.4; }
        }
        
        @keyframes float-around-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            30% { transform: translate(25px, -25px) scale(1.1); opacity: 0.6; }
            60% { transform: translate(45px, -10px) scale(0.9); opacity: 0.5; }
            80% { transform: translate(15px, -20px) scale(1.2); opacity: 0.4; }
        }
        
        @keyframes float-around-4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            20% { transform: translate(-30px, -15px) scale(1.2); opacity: 0.6; }
            50% { transform: translate(-50px, -30px) scale(0.8); opacity: 0.5; }
            80% { transform: translate(-25px, -20px) scale(1.1); opacity: 0.4; }
        }
        
        @keyframes float-around-5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            35% { transform: translate(35px, 20px) scale(1.3); opacity: 0.6; }
            70% { transform: translate(20px, -15px) scale(0.9); opacity: 0.5; }
        }
        
        @keyframes float-around-6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            40% { transform: translate(-35px, 25px) scale(1.1); opacity: 0.6; }
            75% { transform: translate(-15px, -20px) scale(0.8); opacity: 0.5; }
        }
        
        @keyframes card-float {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            25% { transform: translateY(-10px) rotateX(5deg) rotateY(-5deg); }
            50% { transform: translateY(0px) rotateX(0deg) rotateY(5deg); }
            75% { transform: translateY(-10px) rotateX(-5deg) rotateY(0deg); }
        }
        
        /* Équation trinôme au centre */
        .badge::after {
            content: ''ax²+bx+c'';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 42px;
            font-weight: 900;
            
            /* Dégradé doré brillant */
            background: linear-gradient(135deg, 
                #F4D03F 0%,
                #FFF8DC 25%,
                #F9E79F 50%,
                #E8C547 75%,
                #D4AF37 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 3px rgba(244, 208, 63, 0.7))
                    drop-shadow(0 0 6px rgba(244, 208, 63, 0.5))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
            
            font-family: Georgia, serif;
            font-style: italic;
            animation: 
                magic-zoom 6s ease-in-out forwards,
                coin-shine 6s ease-in-out forwards;
            animation-iteration-count: 1;
            z-index: 10;
        }
        
        @keyframes magic-zoom {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; filter: blur(10px); }
            25% { transform: translate(-50%, -50%) scale(1.6) rotate(360deg); opacity: 1; filter: blur(0px); }
            30%, 100% { transform: translate(-50%, -50%) scale(1.6) rotate(360deg); opacity: 1; filter: blur(0px); }
        }
        
        @keyframes coin-shine {
            0%, 23% { filter: drop-shadow(0 0 3px rgba(244, 208, 63, 0.7)) drop-shadow(0 0 6px rgba(244, 208, 63, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) brightness(1); }
            25% { filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 15px rgba(244, 208, 63, 0.8)) drop-shadow(0 0 25px rgba(244, 208, 63, 0.6)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) brightness(1.4); }
            27%, 100% { filter: drop-shadow(0 0 3px rgba(244, 208, 63, 0.7)) drop-shadow(0 0 6px rgba(244, 208, 63, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) brightness(1); }
        }
        
        @keyframes halo-burst {
            0%, 23% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            24.5% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
            25% { transform: translate(-50%, -50%) scale(2); opacity: 0.9; }
            26% { transform: translate(-50%, -50%) scale(2.8); opacity: 0.4; }
            27% { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
        
        /* Flash lumineux */
        .shine-flash {
            position: absolute;
            top: 50%; left: 50%;
            width: 120px;
            height: 120px;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 15;
            pointer-events: none;
        }
        
        .shine-flash::before {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            animation: flash-diagonal-1 6s ease-out forwards;
        }
        
        .shine-flash::after {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(-45deg);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            animation: flash-diagonal-2 6s ease-out forwards;
        }
        
        @keyframes flash-diagonal-1 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 0.9; width: 250%; }
            26% { opacity: 0; width: 300%; }
            100% { opacity: 0; }
        }
        
        @keyframes flash-diagonal-2 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 0.9; width: 250%; }
            26% { opacity: 0; width: 300%; }
            100% { opacity: 0; }
        }
        
        @keyframes particle-burst {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
            1% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(calc((100vw / 10) * cos(var(--angle, 0) * 1deg)), calc((100vw / 10) * sin(var(--angle, 0) * 1deg))) scale(1); opacity: 0; }
        }
        
        .particle:nth-child(2) { --angle: 0; }
        .particle:nth-child(3) { --angle: 45; }
        .particle:nth-child(4) { --angle: 90; }
        .particle:nth-child(5) { --angle: 135; }
        .particle:nth-child(6) { --angle: 180; }
        .particle:nth-child(7) { --angle: 225; }
        .particle:nth-child(8) { --angle: 270; }
        .particle:nth-child(9) { --angle: 315; }
        
        @keyframes glow-pulse-silver {
            0%, 100% { box-shadow: 0 8px 32px rgba(8, 145, 178, 0.5), 0 0 0 5px rgba(255, 255, 255, 0.9), 0 0 0 10px #c0c0c0, 0 0 0 15px rgba(192, 192, 192, 0.5), 0 0 60px rgba(6, 182, 212, 0.6); }
            50% { box-shadow: 0 8px 32px rgba(8, 145, 178, 0.7), 0 0 0 5px rgba(255, 255, 255, 1), 0 0 0 10px #d4d4d4, 0 0 0 15px rgba(212, 212, 212, 0.7), 0 0 80px rgba(6, 182, 212, 0.8); }
        }
        
        /* 2 étoiles coins supérieurs */
        .star {
            position: absolute;
            font-size: 20px;
            z-index: 25;
            opacity: 0;
            animation: star-appear 1s ease-out forwards;
            animation-delay: 3s;
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
        }
        
        .star:nth-child(16) {
            top: 10px;
            left: 10px;
        }
        
        .star:nth-child(17) {
            top: 10px;
            right: 10px;
        }
        
        @keyframes star-appear {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
            100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }', "useCustomCSS" = true WHERE id = 'badge_seconddegre_confirme';

-- Badge: EXPERT
UPDATE badges SET "customCSS" = 'body {
            background: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        
        .badge {
            position: relative;
            width: 250px;
            height: 350px;
            border-radius: 16px;
            background: linear-gradient(135deg, #047857 0%, #10b981 50%, #6ee7b7 100%);
            box-shadow: 
                0 8px 32px rgba(16, 185, 129, 0.6),
                0 0 0 6px rgba(255, 255, 255, 0.95),
                0 0 0 12px #D4AF37,
                0 0 0 18px rgba(212, 175, 55, 0.6),
                inset 0 0 70px rgba(255, 255, 255, 0.2);
            overflow: visible;
            animation: card-float 4s ease-in-out infinite, glow-pulse-gold 2s ease-in-out infinite;
        }
        
        /* Logo "Master Maths" premium */
        .badge-brand {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            
            /* Dégradé or éclatant */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFED4E 25%,
                #FFF9C4 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.9))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            overflow: hidden;
            white-space: nowrap;
            width: 0;
            animation: typewriter 1.5s steps(12) forwards;
            animation-delay: 0.5s;
            opacity: 0;
        }
        
        @keyframes typewriter {
            0% { width: 0; opacity: 1; }
            100% { width: 125px; opacity: 1; }
        }
        
        /* Titre de maîtrise */
        .badge-title {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 15px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
            
            /* Dégradé or éclatant */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFED4E 25%,
                #FFF9C4 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.9))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            opacity: 0;
            animation: fade-in-title 1s ease-out forwards;
            animation-delay: 2.5s;
        }
        
        @keyframes fade-in-title {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* Effet de lumière moiré au fond */
        .badge::before {
            content: '''';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.05) 6px),
                repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.05) 6px),
                radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
            animation: moire-effect 8s ease-in-out infinite;
            pointer-events: none;
            border-radius: 16px;
        }
        
        @keyframes moire-effect {
            0%, 100% { opacity: 0.7; transform: rotate(0deg) scale(1); }
            50% { opacity: 1; transform: rotate(2deg) scale(1.02); }
        }
        
        /* Halo lumineux */
        .halo {
            position: absolute;
            top: 50%; left: 50%;
            width: 220px;
            height: 220px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 215, 0, 0) 70%);
            opacity: 0;
            animation: halo-burst 6s ease-in-out forwards;
            z-index: 5;
        }
        
        /* Particules d''explosion */
        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 9px;
            height: 9px;
            background: #FFD700;
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 12px #FFD700, 0 0 20px rgba(255, 215, 0, 0.8);
        }
        
        .particle:nth-child(2) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.5s; }
        .particle:nth-child(3) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.55s; }
        .particle:nth-child(4) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.6s; }
        .particle:nth-child(5) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.65s; }
        .particle:nth-child(6) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.7s; }
        .particle:nth-child(7) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.75s; }
        .particle:nth-child(8) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.8s; }
        .particle:nth-child(9) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.85s; }
        
        /* Particules flottantes (plus nombreuses) */
        .floating-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #FFD700;
            border-radius: 50%;
            box-shadow: 0 0 12px #FFD700, 0 0 20px rgba(255, 215, 0, 0.7);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 3s;
        }
        
        .floating-particle:nth-child(10) { top: 20%; left: 15%; animation: float-around-1 8s infinite; }
        .floating-particle:nth-child(11) { top: 30%; right: 20%; animation: float-around-2 10s infinite; animation-delay: 3.5s; }
        .floating-particle:nth-child(12) { bottom: 25%; left: 20%; animation: float-around-3 9s infinite; animation-delay: 4s; }
        .floating-particle:nth-child(13) { bottom: 35%; right: 15%; animation: float-around-4 11s infinite; animation-delay: 4.5s; }
        .floating-particle:nth-child(14) { top: 50%; left: 10%; animation: float-around-5 7s infinite; animation-delay: 5s; }
        .floating-particle:nth-child(15) { top: 60%; right: 10%; animation: float-around-6 9.5s infinite; animation-delay: 5.5s; }
        .floating-particle:nth-child(16) { top: 40%; left: 50%; animation: float-around-1 8.5s infinite; animation-delay: 5.8s; }
        .floating-particle:nth-child(17) { bottom: 45%; right: 50%; animation: float-around-2 9.2s infinite; animation-delay: 6.2s; }
        
        @keyframes float-around-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            25% { transform: translate(30px, -20px) scale(1.3); opacity: 0.7; }
            50% { transform: translate(50px, 10px) scale(0.9); opacity: 0.5; }
            75% { transform: translate(20px, 30px) scale(1.2); opacity: 0.6; }
        }
        
        @keyframes float-around-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            25% { transform: translate(-40px, 20px) scale(1); opacity: 0.7; }
            50% { transform: translate(-20px, -30px) scale(1.4); opacity: 0.6; }
            75% { transform: translate(-35px, 15px) scale(1.1); opacity: 0.5; }
        }
        
        @keyframes float-around-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            30% { transform: translate(25px, -25px) scale(1.2); opacity: 0.7; }
            60% { transform: translate(45px, -10px) scale(1); opacity: 0.6; }
            80% { transform: translate(15px, -20px) scale(1.3); opacity: 0.5; }
        }
        
        @keyframes float-around-4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            20% { transform: translate(-30px, -15px) scale(1.3); opacity: 0.7; }
            50% { transform: translate(-50px, -30px) scale(0.9); opacity: 0.6; }
            80% { transform: translate(-25px, -20px) scale(1.2); opacity: 0.5; }
        }
        
        @keyframes float-around-5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            35% { transform: translate(35px, 20px) scale(1.4); opacity: 0.7; }
            70% { transform: translate(20px, -15px) scale(1); opacity: 0.6; }
        }
        
        @keyframes float-around-6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            40% { transform: translate(-35px, 25px) scale(1.2); opacity: 0.7; }
            75% { transform: translate(-15px, -20px) scale(0.9); opacity: 0.6; }
        }
        
        @keyframes card-float {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            25% { transform: translateY(-10px) rotateX(5deg) rotateY(-5deg); }
            50% { transform: translateY(0px) rotateX(0deg) rotateY(5deg); }
            75% { transform: translateY(-10px) rotateX(-5deg) rotateY(0deg); }
        }
        
        /* Delta (discriminant) au centre */
        .badge::after {
            content: ''Δ'';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 120px;
            font-weight: 900;
            
            /* Dégradé or éclatant */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFED4E 25%,
                #FFF9C4 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))
                    drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
            
            font-family: Georgia, serif;
            animation: 
                magic-zoom 6s ease-in-out forwards,
                coin-shine 6s ease-in-out forwards;
            animation-iteration-count: 1;
            z-index: 10;
        }
        
        @keyframes magic-zoom {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; filter: blur(10px); }
            25% { transform: translate(-50%, -50%) scale(1.6) rotate(360deg); opacity: 1; filter: blur(0px); }
            30%, 100% { transform: translate(-50%, -50%) scale(1.6) rotate(360deg); opacity: 1; filter: blur(0px); }
        }
        
        @keyframes coin-shine {
            0%, 23% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) brightness(1); }
            25% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 215, 0, 1)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) brightness(1.5); }
            27%, 100% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) brightness(1); }
        }
        
        @keyframes halo-burst {
            0%, 23% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            24.5% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
            25% { transform: translate(-50%, -50%) scale(2); opacity: 1; }
            26% { transform: translate(-50%, -50%) scale(2.8); opacity: 0.5; }
            27% { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
        
        /* Flash lumineux */
        .shine-flash {
            position: absolute;
            top: 50%; left: 50%;
            width: 120px;
            height: 120px;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 15;
            pointer-events: none;
        }
        
        .shine-flash::before {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 1.5px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
            animation: flash-diagonal-1 6s ease-out forwards;
        }
        
        .shine-flash::after {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 1.5px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(-45deg);
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
            animation: flash-diagonal-2 6s ease-out forwards;
        }
        
        @keyframes flash-diagonal-1 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 250%; }
            26% { opacity: 0; width: 300%; }
            100% { opacity: 0; }
        }
        
        @keyframes flash-diagonal-2 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 250%; }
            26% { opacity: 0; width: 300%; }
            100% { opacity: 0; }
        }
        
        @keyframes particle-burst {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
            1% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(calc((100vw / 10) * cos(var(--angle, 0) * 1deg)), calc((100vw / 10) * sin(var(--angle, 0) * 1deg))) scale(1); opacity: 0; }
        }
        
        .particle:nth-child(2) { --angle: 0; }
        .particle:nth-child(3) { --angle: 45; }
        .particle:nth-child(4) { --angle: 90; }
        .particle:nth-child(5) { --angle: 135; }
        .particle:nth-child(6) { --angle: 180; }
        .particle:nth-child(7) { --angle: 225; }
        .particle:nth-child(8) { --angle: 270; }
        .particle:nth-child(9) { --angle: 315; }
        
        @keyframes glow-pulse-gold {
            0%, 100% { box-shadow: 0 8px 32px rgba(16, 185, 129, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.95), 0 0 0 12px #D4AF37, 0 0 0 18px rgba(212, 175, 55, 0.6), 0 0 70px rgba(255, 215, 0, 0.5); }
            50% { box-shadow: 0 8px 32px rgba(16, 185, 129, 0.8), 0 0 0 6px rgba(255, 255, 255, 1), 0 0 0 12px #E8C547, 0 0 0 18px rgba(232, 197, 71, 0.8), 0 0 90px rgba(255, 215, 0, 0.7); }
        }
        
        /* 3 étoiles en triangle */
        .star {
            position: absolute;
            font-size: 22px;
            z-index: 25;
            opacity: 0;
            animation: star-appear 1s ease-out forwards;
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.9));
        }
        
        .star:nth-child(18) {
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            animation-delay: 3s;
        }
        
        .star:nth-child(19) {
            bottom: 120px;
            left: 15px;
            animation-delay: 3.2s;
        }
        
        .star:nth-child(20) {
            bottom: 120px;
            right: 15px;
            animation-delay: 3.4s;
        }
        
        @keyframes star-appear {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.4) rotate(180deg); }
            100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }', "useCustomCSS" = true WHERE id = 'badge_seconddegre_expert';

-- Badge: MAÎTRE
UPDATE badges SET "customCSS" = 'body {
            background: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        
        .badge {
            position: relative;
            width: 250px;
            height: 350px;
            border-radius: 16px;
            background: linear-gradient(135deg, #991b1b 0%, #dc2626 25%, #f97316 50%, #fbbf24 75%, #fde047 100%);
            box-shadow: 
                0 10px 40px rgba(251, 191, 36, 0.7),
                0 0 0 7px rgba(255, 255, 255, 1),
                0 0 0 15px #E8B4BC,
                0 0 0 22px rgba(232, 180, 188, 0.7),
                inset 0 0 80px rgba(255, 255, 255, 0.25);
            overflow: visible;
            animation: card-float 4s ease-in-out infinite, glow-pulse-master 2s ease-in-out infinite;
        }
        
        /* Logo "Master Maths" premium */
        .badge-brand {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            
            /* Dégradé or rose */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFB6C1 25%,
                #FFC0CB 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 5px rgba(255, 182, 193, 1))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            overflow: hidden;
            white-space: nowrap;
            width: 0;
            animation: typewriter 1.5s steps(12) forwards;
            animation-delay: 0.5s;
            opacity: 0;
        }
        
        @keyframes typewriter {
            0% { width: 0; opacity: 1; }
            100% { width: 125px; opacity: 1; }
        }
        
        /* Titre de maîtrise */
        .badge-title {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 4px;
            text-transform: uppercase;
            
            /* Dégradé or rose */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFB6C1 25%,
                #FFC0CB 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 6px rgba(255, 182, 193, 1))
                    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            opacity: 0;
            animation: fade-in-title 1s ease-out forwards;
            animation-delay: 2.5s;
        }
        
        @keyframes fade-in-title {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* Effet de lumière moiré au fond */
        .badge::before {
            content: '''';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.06) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.06) 6px),
                repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0px, transparent 2px, transparent 4px, rgba(255, 255, 255, 0.06) 6px),
                radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 60%);
            animation: moire-effect 8s ease-in-out infinite;
            pointer-events: none;
            border-radius: 16px;
        }
        
        @keyframes moire-effect {
            0%, 100% { opacity: 0.8; transform: rotate(0deg) scale(1); }
            50% { opacity: 1; transform: rotate(2deg) scale(1.02); }
        }
        
        /* Halo lumineux */
        .halo {
            position: absolute;
            top: 50%; left: 50%;
            width: 240px;
            height: 240px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 182, 193, 0.5) 50%, rgba(255, 215, 0, 0) 70%);
            opacity: 0;
            animation: halo-burst 6s ease-in-out forwards;
            z-index: 5;
        }
        
        /* Rayons de lumière depuis le centre */
        .light-ray {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 150px;
            background: linear-gradient(to top, transparent, rgba(255, 215, 0, 0.6), transparent);
            transform-origin: bottom center;
            opacity: 0;
            animation: ray-appear 2s ease-out forwards;
        }
        
        .light-ray:nth-child(23) {
            transform: translate(-50%, -100%) rotate(0deg);
            animation-delay: 2.5s;
        }
        
        .light-ray:nth-child(24) {
            transform: translate(-50%, -100%) rotate(60deg);
            animation-delay: 2.6s;
        }
        
        .light-ray:nth-child(25) {
            transform: translate(-50%, -100%) rotate(120deg);
            animation-delay: 2.7s;
        }
        
        .light-ray:nth-child(26) {
            transform: translate(-50%, -100%) rotate(180deg);
            animation-delay: 2.8s;
        }
        
        .light-ray:nth-child(27) {
            transform: translate(-50%, -100%) rotate(240deg);
            animation-delay: 2.9s;
        }
        
        .light-ray:nth-child(28) {
            transform: translate(-50%, -100%) rotate(300deg);
            animation-delay: 3s;
        }
        
        @keyframes ray-appear {
            0% { opacity: 0; height: 0; }
            50% { opacity: 0.8; height: 180px; }
            100% { opacity: 0.5; height: 150px; }
        }
        
        /* Particules d''explosion */
        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg, #FFD700, #FFB6C1);
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 15px #FFD700, 0 0 25px rgba(255, 182, 193, 0.9);
        }
        
        .particle:nth-child(2) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.5s; }
        .particle:nth-child(3) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.55s; }
        .particle:nth-child(4) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.6s; }
        .particle:nth-child(5) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.65s; }
        .particle:nth-child(6) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.7s; }
        .particle:nth-child(7) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.75s; }
        .particle:nth-child(8) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.8s; }
        .particle:nth-child(9) { animation: particle-burst 2s ease-out forwards; animation-delay: 1.85s; }
        
        /* Particules flottantes (10 particules) */
        .floating-particle {
            position: absolute;
            width: 7px;
            height: 7px;
            background: linear-gradient(135deg, #FFD700, #FFB6C1);
            border-radius: 50%;
            box-shadow: 0 0 15px #FFD700, 0 0 25px rgba(255, 182, 193, 0.8);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 3s;
        }
        
        .floating-particle:nth-child(10) { top: 20%; left: 15%; animation: float-around-1 8s infinite; }
        .floating-particle:nth-child(11) { top: 30%; right: 20%; animation: float-around-2 10s infinite; animation-delay: 3.5s; }
        .floating-particle:nth-child(12) { bottom: 25%; left: 20%; animation: float-around-3 9s infinite; animation-delay: 4s; }
        .floating-particle:nth-child(13) { bottom: 35%; right: 15%; animation: float-around-4 11s infinite; animation-delay: 4.5s; }
        .floating-particle:nth-child(14) { top: 50%; left: 10%; animation: float-around-5 7s infinite; animation-delay: 5s; }
        .floating-particle:nth-child(15) { top: 60%; right: 10%; animation: float-around-6 9.5s infinite; animation-delay: 5.5s; }
        .floating-particle:nth-child(16) { top: 40%; left: 50%; animation: float-around-1 8.5s infinite; animation-delay: 5.8s; }
        .floating-particle:nth-child(17) { bottom: 45%; right: 50%; animation: float-around-2 9.2s infinite; animation-delay: 6.2s; }
        .floating-particle:nth-child(18) { top: 70%; left: 25%; animation: float-around-3 8.8s infinite; animation-delay: 6.5s; }
        .floating-particle:nth-child(19) { top: 25%; right: 30%; animation: float-around-4 10.5s infinite; animation-delay: 6.8s; }
        
        @keyframes float-around-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            25% { transform: translate(30px, -20px) scale(1.4); opacity: 0.8; }
            50% { transform: translate(50px, 10px) scale(1); opacity: 0.6; }
            75% { transform: translate(20px, 30px) scale(1.3); opacity: 0.7; }
        }
        
        @keyframes float-around-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            25% { transform: translate(-40px, 20px) scale(1.1); opacity: 0.8; }
            50% { transform: translate(-20px, -30px) scale(1.5); opacity: 0.7; }
            75% { transform: translate(-35px, 15px) scale(1.2); opacity: 0.6; }
        }
        
        @keyframes float-around-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            30% { transform: translate(25px, -25px) scale(1.3); opacity: 0.8; }
            60% { transform: translate(45px, -10px) scale(1.1); opacity: 0.7; }
            80% { transform: translate(15px, -20px) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes float-around-4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            20% { transform: translate(-30px, -15px) scale(1.4); opacity: 0.8; }
            50% { transform: translate(-50px, -30px) scale(1); opacity: 0.7; }
            80% { transform: translate(-25px, -20px) scale(1.3); opacity: 0.6; }
        }
        
        @keyframes float-around-5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            35% { transform: translate(35px, 20px) scale(1.5); opacity: 0.8; }
            70% { transform: translate(20px, -15px) scale(1.1); opacity: 0.7; }
        }
        
        @keyframes float-around-6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            40% { transform: translate(-35px, 25px) scale(1.3); opacity: 0.8; }
            75% { transform: translate(-15px, -20px) scale(1); opacity: 0.7; }
        }
        
        @keyframes card-float {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            25% { transform: translateY(-12px) rotateX(6deg) rotateY(-6deg); }
            50% { transform: translateY(0px) rotateX(0deg) rotateY(6deg); }
            75% { transform: translateY(-12px) rotateX(-6deg) rotateY(0deg); }
        }
        
        /* Parabole au centre */
        .badge::after {
            content: ''∩'';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 140px;
            font-weight: 900;
            
            /* Dégradé or rose premium */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFB6C1 25%,
                #FFC0CB 50%,
                #FFD700 75%,
                #FFA500 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.9))
                    drop-shadow(0 0 10px rgba(255, 182, 193, 0.8))
                    drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4));
            
            font-family: Georgia, serif;
            animation: 
                magic-zoom 6s ease-in-out forwards,
                coin-shine 6s ease-in-out forwards;
            animation-iteration-count: 1;
            z-index: 10;
        }
        
        @keyframes magic-zoom {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; filter: blur(10px); }
            25% { transform: translate(-50%, -50%) scale(1.7) rotate(360deg); opacity: 1; filter: blur(0px); }
            30%, 100% { transform: translate(-50%, -50%) scale(1.7) rotate(360deg); opacity: 1; filter: blur(0px); }
        }
        
        @keyframes coin-shine {
            0%, 23% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 10px rgba(255, 182, 193, 0.8)) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4)) brightness(1); }
            25% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1)) drop-shadow(0 0 25px rgba(255, 215, 0, 1)) drop-shadow(0 0 40px rgba(255, 182, 193, 1)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) brightness(1.6); }
            27%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 10px rgba(255, 182, 193, 0.8)) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4)) brightness(1); }
        }
        
        @keyframes halo-burst {
            0%, 23% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            24.5% { transform: translate(-50%, -50%) scale(1.6); opacity: 0.9; }
            25% { transform: translate(-50%, -50%) scale(2.1); opacity: 1; }
            26% { transform: translate(-50%, -50%) scale(2.9); opacity: 0.6; }
            27% { transform: translate(-50%, -50%) scale(3.3); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
        
        /* Flash lumineux */
        .shine-flash {
            position: absolute;
            top: 50%; left: 50%;
            width: 130px;
            height: 130px;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 15;
            pointer-events: none;
        }
        
        .shine-flash::before {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
            animation: flash-diagonal-1 6s ease-out forwards;
        }
        
        .shine-flash::after {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 80%, transparent 100%);
            transform: translate(-50%, -50%) rotate(-45deg);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
            animation: flash-diagonal-2 6s ease-out forwards;
        }
        
        @keyframes flash-diagonal-1 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 260%; }
            26% { opacity: 0; width: 320%; }
            100% { opacity: 0; }
        }
        
        @keyframes flash-diagonal-2 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 260%; }
            26% { opacity: 0; width: 320%; }
            100% { opacity: 0; }
        }
        
        @keyframes particle-burst {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
            1% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(calc((100vw / 10) * cos(var(--angle, 0) * 1deg)), calc((100vw / 10) * sin(var(--angle, 0) * 1deg))) scale(1); opacity: 0; }
        }
        
        .particle:nth-child(2) { --angle: 0; }
        .particle:nth-child(3) { --angle: 45; }
        .particle:nth-child(4) { --angle: 90; }
        .particle:nth-child(5) { --angle: 135; }
        .particle:nth-child(6) { --angle: 180; }
        .particle:nth-child(7) { --angle: 225; }
        .particle:nth-child(8) { --angle: 270; }
        .particle:nth-child(9) { --angle: 315; }
        
        @keyframes glow-pulse-master {
            0%, 100% { 
                box-shadow: 
                    0 10px 40px rgba(251, 191, 36, 0.7),
                    0 0 0 7px rgba(255, 255, 255, 1),
                    0 0 0 15px #E8B4BC,
                    0 0 0 22px rgba(232, 180, 188, 0.7),
                    0 0 80px rgba(255, 182, 193, 0.6); 
            }
            50% { 
                box-shadow: 
                    0 10px 40px rgba(251, 191, 36, 0.9),
                    0 0 0 7px rgba(255, 255, 255, 1),
                    0 0 0 15px #FFB6C1,
                    0 0 0 22px rgba(255, 182, 193, 0.9),
                    0 0 100px rgba(255, 215, 0, 0.8); 
            }
        }
        
        /* 4 étoiles aux 4 coins */
        .star {
            position: absolute;
            font-size: 24px;
            z-index: 25;
            opacity: 0;
            animation: star-appear 1s ease-out forwards;
            filter: drop-shadow(0 0 12px rgba(255, 215, 0, 1));
        }
        
        .star:nth-child(20) {
            top: 10px;
            left: 10px;
            animation-delay: 3s;
        }
        
        .star:nth-child(21) {
            top: 10px;
            right: 10px;
            animation-delay: 3.2s;
        }
        
        .star:nth-child(22) {
            bottom: 80px;
            left: 10px;
            animation-delay: 3.4s;
        }
        
        .star:nth-child(29) {
            bottom: 80px;
            right: 10px;
            animation-delay: 3.6s;
        }
        
        @keyframes star-appear {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
            100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }', "useCustomCSS" = true WHERE id = 'badge_seconddegre_maitre';

-- Badge: VIRTUOSE
UPDATE badges SET "customCSS" = 'body {
            background: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        
        .badge {
            position: relative;
            width: 250px;
            height: 350px;
            border-radius: 16px;
            background: 
                radial-gradient(ellipse at 30% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
                linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
            box-shadow: 
                0 12px 50px rgba(255, 215, 0, 0.9),
                0 0 0 3px rgba(255, 255, 255, 1),
                0 0 0 8px #000000,
                0 0 0 18px #FFD700,
                0 0 0 26px rgba(255, 215, 0, 0.8),
                inset 0 0 100px rgba(255, 215, 0, 0.3);
            overflow: visible;
            animation: card-float-ultimate 4s ease-in-out infinite, glow-pulse-ultimate 2s ease-in-out infinite;
        }
        
        /* Logo "Master Maths" premium arc-en-ciel */
        .badge-brand {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            
            /* Dégradé or platine arc-en-ciel */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFA500 15%,
                #FF1493 30%,
                #9370DB 45%,
                #00CED1 60%,
                #FFD700 75%,
                #FFF 90%,
                #FFD700 100%
            );
            background-size: 200% 200%;
            animation: rainbow-shift 3s ease-in-out infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
                    drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            overflow: hidden;
            white-space: nowrap;
            width: 0;
            animation: typewriter 1.5s steps(12) forwards, rainbow-shift 3s ease-in-out infinite;
            animation-delay: 0.5s, 0s;
            opacity: 0;
        }
        
        @keyframes typewriter {
            0% { width: 0; opacity: 1; }
            100% { width: 125px; opacity: 1; }
        }
        
        @keyframes rainbow-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        /* Titre de maîtrise */
        .badge-title {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 17px;
            font-weight: 900;
            letter-spacing: 5px;
            text-transform: uppercase;
            
            /* Dégradé or platine arc-en-ciel */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFA500 15%,
                #FF1493 30%,
                #9370DB 45%,
                #00CED1 60%,
                #FFD700 75%,
                #FFF 90%,
                #FFD700 100%
            );
            background-size: 200% 200%;
            animation: rainbow-shift 3s ease-in-out infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 1))
                    drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))
                    drop-shadow(0 2px 5px rgba(0, 0, 0, 0.6));
            
            font-family: ''Arial Black'', Arial, sans-serif;
            z-index: 20;
            opacity: 0;
            animation: fade-in-title 1s ease-out forwards, rainbow-shift 3s ease-in-out infinite;
            animation-delay: 2.5s, 0s;
        }
        
        @keyframes fade-in-title {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* Effet de lumière moiré au fond */
        .badge::before {
            content: '''';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(0deg, rgba(255, 215, 0, 0.08) 0px, transparent 2px, transparent 4px, rgba(255, 215, 0, 0.08) 6px),
                repeating-linear-gradient(90deg, rgba(255, 215, 0, 0.08) 0px, transparent 2px, transparent 4px, rgba(255, 215, 0, 0.08) 6px),
                radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 60%);
            animation: moire-effect-ultimate 8s ease-in-out infinite;
            pointer-events: none;
            border-radius: 16px;
        }
        
        @keyframes moire-effect-ultimate {
            0%, 100% { opacity: 0.9; transform: rotate(0deg) scale(1); }
            50% { opacity: 1; transform: rotate(3deg) scale(1.03); }
        }
        
        /* Halo lumineux arc-en-ciel */
        .halo {
            position: absolute;
            top: 50%; left: 50%;
            width: 280px;
            height: 280px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(255, 215, 0, 1) 0%, 
                rgba(255, 165, 0, 0.8) 20%,
                rgba(255, 20, 147, 0.6) 40%,
                rgba(138, 43, 226, 0.4) 60%,
                rgba(255, 215, 0, 0) 80%
            );
            opacity: 0;
            animation: halo-burst-ultimate 6s ease-in-out forwards;
            z-index: 5;
        }
        
        /* God rays permanents */
        .god-ray {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 3px;
            height: 180px;
            background: linear-gradient(to top, 
                transparent, 
                rgba(255, 215, 0, 0.4), 
                rgba(255, 215, 0, 0.8),
                rgba(255, 255, 255, 0.6),
                transparent
            );
            transform-origin: bottom center;
            opacity: 0;
            animation: god-ray-permanent 4s ease-in-out infinite;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
        }
        
        .god-ray:nth-child(24) {
            transform: translate(-50%, -100%) rotate(0deg);
            animation-delay: 2.5s;
        }
        
        .god-ray:nth-child(25) {
            transform: translate(-50%, -100%) rotate(30deg);
            animation-delay: 2.6s;
        }
        
        .god-ray:nth-child(26) {
            transform: translate(-50%, -100%) rotate(60deg);
            animation-delay: 2.7s;
        }
        
        .god-ray:nth-child(27) {
            transform: translate(-50%, -100%) rotate(90deg);
            animation-delay: 2.8s;
        }
        
        .god-ray:nth-child(28) {
            transform: translate(-50%, -100%) rotate(120deg);
            animation-delay: 2.9s;
        }
        
        .god-ray:nth-child(29) {
            transform: translate(-50%, -100%) rotate(150deg);
            animation-delay: 3s;
        }
        
        .god-ray:nth-child(30) {
            transform: translate(-50%, -100%) rotate(180deg);
            animation-delay: 3.1s;
        }
        
        .god-ray:nth-child(31) {
            transform: translate(-50%, -100%) rotate(210deg);
            animation-delay: 3.2s;
        }
        
        .god-ray:nth-child(32) {
            transform: translate(-50%, -100%) rotate(240deg);
            animation-delay: 3.3s;
        }
        
        .god-ray:nth-child(33) {
            transform: translate(-50%, -100%) rotate(270deg);
            animation-delay: 3.4s;
        }
        
        .god-ray:nth-child(34) {
            transform: translate(-50%, -100%) rotate(300deg);
            animation-delay: 3.5s;
        }
        
        .god-ray:nth-child(35) {
            transform: translate(-50%, -100%) rotate(330deg);
            animation-delay: 3.6s;
        }
        
        @keyframes god-ray-permanent {
            0%, 100% { opacity: 0.3; height: 180px; }
            50% { opacity: 0.7; height: 200px; }
        }
        
        /* Aura dorée qui pulse autour du cadre */
        .aura {
            position: absolute;
            top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 18px;
            box-shadow: 
                0 0 30px rgba(255, 215, 0, 0.8),
                0 0 60px rgba(255, 215, 0, 0.6),
                0 0 90px rgba(255, 215, 0, 0.4);
            animation: aura-pulse 2s ease-in-out infinite;
            z-index: -1;
        }
        
        @keyframes aura-pulse {
            0%, 100% { 
                box-shadow: 
                    0 0 30px rgba(255, 215, 0, 0.8),
                    0 0 60px rgba(255, 215, 0, 0.6),
                    0 0 90px rgba(255, 215, 0, 0.4);
            }
            50% { 
                box-shadow: 
                    0 0 50px rgba(255, 215, 0, 1),
                    0 0 100px rgba(255, 215, 0, 0.8),
                    0 0 150px rgba(255, 215, 0, 0.6);
            }
        }
        
        /* Particules d''explosion */
        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, #FFD700, #FFA500);
            border-radius: 50%;
            opacity: 0;
            box-shadow: 
                0 0 20px #FFD700, 
                0 0 35px rgba(255, 215, 0, 1),
                0 0 50px rgba(255, 215, 0, 0.8);
        }
        
        .particle:nth-child(2) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.5s; }
        .particle:nth-child(3) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.55s; }
        .particle:nth-child(4) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.6s; }
        .particle:nth-child(5) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.65s; }
        .particle:nth-child(6) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.7s; }
        .particle:nth-child(7) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.75s; }
        .particle:nth-child(8) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.8s; }
        .particle:nth-child(9) { animation: particle-burst-ultimate 2s ease-out forwards; animation-delay: 1.85s; }
        
        /* Particules flottantes (12 particules) */
        .floating-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #FFD700, #FFA500);
            border-radius: 50%;
            box-shadow: 
                0 0 20px #FFD700, 
                0 0 35px rgba(255, 215, 0, 0.9);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 3s;
        }
        
        .floating-particle:nth-child(10) { top: 20%; left: 15%; animation: float-around-ultimate-1 8s infinite; }
        .floating-particle:nth-child(11) { top: 30%; right: 20%; animation: float-around-ultimate-2 10s infinite; animation-delay: 3.5s; }
        .floating-particle:nth-child(12) { bottom: 25%; left: 20%; animation: float-around-ultimate-3 9s infinite; animation-delay: 4s; }
        .floating-particle:nth-child(13) { bottom: 35%; right: 15%; animation: float-around-ultimate-4 11s infinite; animation-delay: 4.5s; }
        .floating-particle:nth-child(14) { top: 50%; left: 10%; animation: float-around-ultimate-5 7s infinite; animation-delay: 5s; }
        .floating-particle:nth-child(15) { top: 60%; right: 10%; animation: float-around-ultimate-6 9.5s infinite; animation-delay: 5.5s; }
        .floating-particle:nth-child(16) { top: 40%; left: 50%; animation: float-around-ultimate-1 8.5s infinite; animation-delay: 5.8s; }
        .floating-particle:nth-child(17) { bottom: 45%; right: 50%; animation: float-around-ultimate-2 9.2s infinite; animation-delay: 6.2s; }
        .floating-particle:nth-child(18) { top: 70%; left: 25%; animation: float-around-ultimate-3 8.8s infinite; animation-delay: 6.5s; }
        .floating-particle:nth-child(19) { top: 25%; right: 30%; animation: float-around-ultimate-4 10.5s infinite; animation-delay: 6.8s; }
        .floating-particle:nth-child(20) { top: 15%; left: 40%; animation: float-around-ultimate-5 9.3s infinite; animation-delay: 7.1s; }
        .floating-particle:nth-child(21) { bottom: 50%; left: 35%; animation: float-around-ultimate-6 8.7s infinite; animation-delay: 7.4s; }
        
        @keyframes float-around-ultimate-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            25% { transform: translate(30px, -20px) scale(1.5); opacity: 0.9; }
            50% { transform: translate(50px, 10px) scale(1.1); opacity: 0.7; }
            75% { transform: translate(20px, 30px) scale(1.4); opacity: 0.8; }
        }
        
        @keyframes float-around-ultimate-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            25% { transform: translate(-40px, 20px) scale(1.2); opacity: 0.9; }
            50% { transform: translate(-20px, -30px) scale(1.6); opacity: 0.8; }
            75% { transform: translate(-35px, 15px) scale(1.3); opacity: 0.7; }
        }
        
        @keyframes float-around-ultimate-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            30% { transform: translate(25px, -25px) scale(1.4); opacity: 0.9; }
            60% { transform: translate(45px, -10px) scale(1.2); opacity: 0.8; }
            80% { transform: translate(15px, -20px) scale(1.5); opacity: 0.7; }
        }
        
        @keyframes float-around-ultimate-4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            20% { transform: translate(-30px, -15px) scale(1.5); opacity: 0.9; }
            50% { transform: translate(-50px, -30px) scale(1.1); opacity: 0.8; }
            80% { transform: translate(-25px, -20px) scale(1.4); opacity: 0.7; }
        }
        
        @keyframes float-around-ultimate-5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            35% { transform: translate(35px, 20px) scale(1.6); opacity: 0.9; }
            70% { transform: translate(20px, -15px) scale(1.2); opacity: 0.8; }
        }
        
        @keyframes float-around-ultimate-6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            40% { transform: translate(-35px, 25px) scale(1.4); opacity: 0.9; }
            75% { transform: translate(-15px, -20px) scale(1.1); opacity: 0.8; }
        }
        
        @keyframes card-float-ultimate {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            25% { transform: translateY(-15px) rotateX(7deg) rotateY(-7deg); }
            50% { transform: translateY(0px) rotateX(0deg) rotateY(7deg); }
            75% { transform: translateY(-15px) rotateX(-7deg) rotateY(0deg); }
        }
        
        /* x₁, x₂ (les deux solutions) au centre */
        .badge::after {
            content: ''x₁ x₂'';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 60px;
            font-weight: 900;
            
            /* Dégradé or platine arc-en-ciel */
            background: linear-gradient(135deg, 
                #FFD700 0%,
                #FFA500 15%,
                #FF1493 30%,
                #9370DB 45%,
                #00CED1 60%,
                #FFD700 75%,
                #FFF 90%,
                #FFD700 100%
            );
            background-size: 200% 200%;
            animation: 
                magic-zoom-ultimate 6s ease-in-out forwards,
                coin-shine-ultimate 6s ease-in-out forwards,
                rainbow-shift 3s ease-in-out infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
                    drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
                    drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
                    drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
            
            font-family: Georgia, serif;
            font-style: italic;
            animation-iteration-count: 1, 1, infinite;
            z-index: 10;
        }
        
        @keyframes magic-zoom-ultimate {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; filter: blur(15px); }
            25% { transform: translate(-50%, -50%) scale(1.8) rotate(360deg); opacity: 1; filter: blur(0px); }
            30%, 100% { transform: translate(-50%, -50%) scale(1.8) rotate(360deg); opacity: 1; filter: blur(0px); }
        }
        
        @keyframes coin-shine-ultimate {
            0%, 23% { 
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1)) 
                        drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) 
                        drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
                        drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) 
                        brightness(1); 
            }
            25% { 
                filter: drop-shadow(0 0 15px rgba(255, 255, 255, 1)) 
                        drop-shadow(0 0 30px rgba(255, 215, 0, 1)) 
                        drop-shadow(0 0 50px rgba(255, 215, 0, 1))
                        drop-shadow(0 0 70px rgba(138, 43, 226, 0.8))
                        drop-shadow(0 2px 10px rgba(0, 0, 0, 0.6)) 
                        brightness(1.8); 
            }
            27%, 100% { 
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1)) 
                        drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) 
                        drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
                        drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) 
                        brightness(1); 
            }
        }
        
        @keyframes halo-burst-ultimate {
            0%, 23% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            24.5% { transform: translate(-50%, -50%) scale(1.7); opacity: 1; }
            25% { transform: translate(-50%, -50%) scale(2.2); opacity: 1; }
            26% { transform: translate(-50%, -50%) scale(3); opacity: 0.7; }
            27% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
        
        /* Flash lumineux ULTIME */
        .shine-flash {
            position: absolute;
            top: 50%; left: 50%;
            width: 150px;
            height: 150px;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 15;
            pointer-events: none;
        }
        
        .shine-flash::before {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0) 15%, 
                rgba(255, 255, 255, 1) 50%, 
                rgba(255, 255, 255, 0) 85%, 
                transparent 100%
            );
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 215, 0, 0.8);
            animation: flash-diagonal-ultimate-1 6s ease-out forwards;
        }
        
        .shine-flash::after {
            content: '''';
            position: absolute;
            top: 50%; left: 50%;
            width: 200%;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0) 15%, 
                rgba(255, 255, 255, 1) 50%, 
                rgba(255, 255, 255, 0) 85%, 
                transparent 100%
            );
            transform: translate(-50%, -50%) rotate(-45deg);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 215, 0, 0.8);
            animation: flash-diagonal-ultimate-2 6s ease-out forwards;
        }
        
        @keyframes flash-diagonal-ultimate-1 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 280%; }
            26% { opacity: 0; width: 350%; }
            100% { opacity: 0; }
        }
        
        @keyframes flash-diagonal-ultimate-2 {
            0%, 24% { opacity: 0; width: 80%; }
            25% { opacity: 1; width: 280%; }
            26% { opacity: 0; width: 350%; }
            100% { opacity: 0; }
        }
        
        @keyframes particle-burst-ultimate {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
            1% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(calc((100vw / 9) * cos(var(--angle, 0) * 1deg)), calc((100vw / 9) * sin(var(--angle, 0) * 1deg))) scale(1.5); opacity: 0; }
        }
        
        .particle:nth-child(2) { --angle: 0; }
        .particle:nth-child(3) { --angle: 45; }
        .particle:nth-child(4) { --angle: 90; }
        .particle:nth-child(5) { --angle: 135; }
        .particle:nth-child(6) { --angle: 180; }
        .particle:nth-child(7) { --angle: 225; }
        .particle:nth-child(8) { --angle: 270; }
        .particle:nth-child(9) { --angle: 315; }
        
        @keyframes glow-pulse-ultimate {
            0%, 100% { 
                box-shadow: 
                    0 12px 50px rgba(255, 215, 0, 0.9),
                    0 0 0 3px rgba(255, 255, 255, 1),
                    0 0 0 8px #000000,
                    0 0 0 18px #FFD700,
                    0 0 0 26px rgba(255, 215, 0, 0.8),
                    0 0 100px rgba(255, 215, 0, 0.7); 
            }
            50% { 
                box-shadow: 
                    0 12px 50px rgba(255, 215, 0, 1),
                    0 0 0 3px rgba(255, 255, 255, 1),
                    0 0 0 8px #000000,
                    0 0 0 18px #FFE44D,
                    0 0 0 26px rgba(255, 228, 77, 1),
                    0 0 150px rgba(255, 215, 0, 1); 
            }
        }
        
        /* 5 étoiles en arc de cercle au-dessus */
        .star {
            position: absolute;
            font-size: 28px;
            z-index: 25;
            opacity: 0;
            animation: star-appear-ultimate 1.2s ease-out forwards;
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 1))
                    drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
        }
        
        .star:nth-child(22) {
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            animation-delay: 3.8s;
        }
        
        .star:nth-child(23) {
            top: 30px;
            left: 25%;
            animation-delay: 3.6s;
        }
        
        .star:nth-child(36) {
            top: 30px;
            right: 25%;
            animation-delay: 4s;
        }
        
        .star:nth-child(37) {
            top: 60px;
            left: 10%;
            animation-delay: 3.4s;
        }
        
        .star:nth-child(38) {
            top: 60px;
            right: 10%;
            animation-delay: 4.2s;
        }
        
        @keyframes star-appear-ultimate {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.8) rotate(180deg); }
            100% { opacity: 1; transform: scale(1.2) rotate(360deg); }
        }', "useCustomCSS" = true WHERE id = 'badge_seconddegre_virtuose';

