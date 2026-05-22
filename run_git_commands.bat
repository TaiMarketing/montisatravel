@echo off
cd /d "c:\Users\User\OneDrive\Desktop\Mis Clientes\STM\WEBSITE.worktrees\agents-continuar-cambios-implementacion"

echo === 1. git log --oneline -10 ===
git log --oneline -10

echo.
echo === 2. git status --short ===
git status --short

echo.
echo === 3. git add -A ===
git add -A

echo.
echo === 4. git diff --cached --stat ===
git diff --cached --stat

echo.
echo === 5. git commit ===
git commit -m "Rediseño hero homepage y header flotante translúcido" -m "- Header fijo y translúcido en desktop con efecto blur, se vuelve opaco al hacer scroll" -m "- En hero: header transparente con textos blancos para máximo impacto visual" -m "- Hero pantalla completa con buscador animado 'cosas que hacer', sugerencias autocomplete y stats" -m "- Barra de categorías sticky con filtros: Todo, Excursiones, Aventura, Cultura, Naturaleza" -m "- Tarjetas de tour mejoradas: rating, badge de categoría, botón favorito, imagen con zoom hover" -m "- Mini-cards de experiencias destacadas al pie del hero" -m "- Sección CTA de Transfer con fondo oscuro" -m "- Footer mejorado con columnas" -m "- Añadidos campos rating, reviewCount, category y pickup a los tours" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo === 6. git status --short ===
git status --short

echo.
echo === 7. git log --oneline -3 ===
git log --oneline -3

echo.
echo === DONE ===
pause
