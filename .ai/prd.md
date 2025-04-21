# Dokument wymagań produktu (PRD) - SnAIck

## 1. Przegląd produktu
SnAIck to aplikacja webowa pomagająca użytkownikom szybko dobrać zdrowe i smaczne przekąski, dopasowane do ich dziennej diety, preferencji oraz ograniczeń żywieniowych. Aplikacja wykorzystuje sztuczną inteligencję do generowania spersonalizowanych propozycji przekąsek na podstawie danych wprowadzonych przez użytkownika poprzez formularz.

Aplikacja skierowana jest do osób pracujących biurowo lub hybrydowo, dbających o zdrowie, będących na diecie, młodych dorosłych, rodziców oraz osób z nietolerancjami pokarmowymi. Wersja MVP będzie dostępna wyłącznie jako aplikacja webowa.

Podstawowy przepływ użytkownika to:
- Rejestracja lub logowanie
- Wypełnienie formularza z informacjami o spożytych posiłkach i preferencjach
- Otrzymanie propozycji przekąski wygenerowanej przez LLM
- Możliwość zapisania przekąski do ulubionych lub wygenerowania nowej propozycji
- Przeglądanie i zarządzanie listą ulubionych przekąsek

## 2. Problem użytkownika
Ludzie często mają ochotę na przekąskę, ale napotykają następujące problemy:
- Nie chcą jeść niezdrowo, ale równocześnie nie mają ochoty na typowe zdrowe przekąski jak marchewka czy jabłko
- Nie wiedzą, ile kalorii już spożyli w ciągu dnia
- Nie wiedzą, co mogą jeszcze zjeść "bez wyrzutów sumienia"
- Mają trudności z doborem przekąsek uwzględniających ich preferencje smakowe, dostępność produktów oraz ograniczenia dietetyczne
- Potrzebują szybkiej decyzji bez konieczności przeszukiwania wielu źródeł i przepisów

SnAIck rozwiązuje ten problem, oferując natychmiastowe, spersonalizowane propozycje przekąsek dostosowane do indywidualnych potrzeb, preferencji i ograniczeń użytkownika, z uwzględnieniem tego, co już zjadł w ciągu dnia oraz co ma dostępne w danej lokalizacji.

## 3. Wymagania funkcjonalne
W ramach minimalnego zestawu funkcjonalności (MVP), aplikacja SnAIck będzie oferować:

1. System rejestracji i logowania
   - Prosty mechanizm uwierzytelniania oparty o email i hasło
   - Podstawowe zabezpieczenia: autoryzacja, uwierzytelnianie i ochrona danych

2. Formularz z danymi użytkownika
   - Informacje o posiłkach spożytych danego dnia
   - Preferencje dotyczące typu przekąski (słodka, słona, lekka, sycąca)
   - Wykluczenia żywieniowe
   - Lokalizacja użytkownika (praca, dom, sklep, poza domem)
   - Cele dietetyczne
   - Ograniczenia kaloryczne
   - Stałe ograniczenia dietetyczne (weganizm, wegetarianizm, nietolerancje, alergie)

3. Generowanie propozycji przekąsek
   - Wykorzystanie modeli LLM poprzez Openrouter.ai
   - Dopasowanie propozycji do danych z formularza
   - Prezentacja wyników w standardowym formacie zawierającym:
     - Nazwę przekąski
     - Krótki opis
     - Listę składników
     - Instrukcje przygotowania
     - Wartości odżywcze (kalorie, białko, tłuszcze, węglowodany, błonnik)

4. Zarządzanie przekąskami
   - Lista wygenerowanych propozycji z opcją dodania do ulubionych
   - Lista ulubionych przekąsek z możliwością edycji (usuwania)
   - Zapisywanie historii przekąsek po zaakceptowaniu propozycji

5. Interfejs użytkownika
   - Responsywny design działający na urządzeniach mobilnych i desktopowych
   - Intuicyjna nawigacja między głównym formularzem a listą ulubionych przekąsek

## 4. Granice produktu
W zakres MVP nie wchodzą następujące funkcjonalności:

1. Automatyczne śledzenie kalorii i spożytych posiłków
2. Dokładna baza składników z mikro i makro elementami
3. Integracja z aplikacjami fitness lub dietetycznymi
4. System oceniania i komentowania przekąsek przez użytkowników
5. Rekomendacje na podstawie historii dnia poprzedniego
6. Import danych z innych źródeł
7. Eksport ulubionych przekąsek
8. Mechanizm raportowania nieodpowiednich propozycji
9. Limity zapytań do LLM per użytkownik
10. Monitorowanie kosztów zapytań do LLM
11. Zaawansowane mechanizmy walidacji jakości odpowiedzi z LLM

## 5. Historyjki użytkowników

### Rejestracja i logowanie

US-001: Rejestracja nowego użytkownika
- Jako nowy użytkownik, chcę zarejestrować się w systemie, aby móc korzystać z aplikacji SnAIck.
- Kryteria akceptacji:
  - Użytkownik może utworzyć konto podając adres email i hasło
  - System weryfikuje, czy adres email jest prawidłowy i unikalny
  - System zapewnia odpowiednie zabezpieczenia hasła
  - Po rejestracji użytkownik otrzymuje dostęp do systemu
  - System przenosi użytkownika na stronę główną po pomyślnej rejestracji

US-002: Logowanie istniejącego użytkownika
- Jako zarejestrowany użytkownik, chcę zalogować się do systemu, aby uzyskać dostęp do mojego konta.
- Kryteria akceptacji:
  - Użytkownik może zalogować się podając adres email i hasło
  - System weryfikuje poprawność danych logowania
  - W przypadku nieprawidłowych danych, system pokazuje odpowiedni komunikat błędu
  - Po pomyślnym logowaniu, użytkownik zostaje przeniesiony na stronę główną

US-003: Wylogowanie z systemu
- Jako zalogowany użytkownik, chcę wylogować się z systemu, aby zabezpieczyć swoje konto.
- Kryteria akceptacji:
  - Użytkownik może wylogować się z systemu poprzez kliknięcie przycisku "Wyloguj"
  - Po wylogowaniu, sesja użytkownika zostaje zakończona
  - Po wylogowaniu, użytkownik zostaje przeniesiony na stronę logowania

### Generowanie przekąsek

US-004: Wypełnienie formularza z preferencjami
- Jako zalogowany użytkownik, chcę wypełnić formularz z moimi preferencjami żywieniowymi, aby otrzymać spersonalizowane propozycje przekąsek.
- Kryteria akceptacji:
  - Formularz zawiera pola do wprowadzenia informacji o spożytych posiłkach
  - Użytkownik może wybrać typ pożądanej przekąski (słodka, słona, lekka, sycąca)
  - Użytkownik może wprowadzić informacje o wykluczeniach żywieniowych
  - Użytkownik może wybrać swoją lokalizację (praca, dom, sklep, poza domem)
  - Użytkownik może określić swój cel dietetyczny
  - Użytkownik może wprowadzić limit kaloryczny, jeśli wybierze odpowiednią opcję celu
  - Użytkownik może zaznaczyć stałe ograniczenia dietetyczne
  - Przycisk "Znajdź mi przekąskę" wysyła formularz

US-005: Generowanie propozycji przekąski
- Jako użytkownik po wypełnieniu formularza, chcę otrzymać propozycję przekąski dopasowaną do moich preferencji.
- Kryteria akceptacji:
  - System przetwarza dane z formularza i generuje spersonalizowaną propozycję
  - Propozycja zawiera nazwę przekąski, opis, składniki, instrukcje przygotowania i wartości odżywcze
  - System wyświetla propozycję w czytelnym formacie
  - Podczas generowania propozycji wyświetlany jest wskaźnik ładowania

US-006: Odrzucenie propozycji i wygenerowanie nowej
- Jako użytkownik przeglądający propozycję przekąski, chcę ją odrzucić i wygenerować nową, jeśli nie odpowiada moim preferencjom.
- Kryteria akceptacji:
  - Użytkownik może odrzucić propozycję poprzez kliknięcie przycisku "Następna"
  - System generuje nową propozycję na podstawie tych samych danych z formularza
  - Nowa propozycja jest wyświetlana w miejsce poprzedniej

### Zarządzanie ulubionymi przekąskami

US-007: Zapisanie przekąski do ulubionych
- Jako użytkownik przeglądający propozycję przekąski, chcę zapisać ją do ulubionych, aby móc do niej wrócić później.
- Kryteria akceptacji:
  - Użytkownik może zapisać propozycję poprzez kliknięcie przycisku "Zapisz"
  - System dodaje przekąskę do listy ulubionych użytkownika
  - System wyświetla potwierdzenie zapisania przekąski

US-008: Przeglądanie listy ulubionych przekąsek
- Jako zalogowany użytkownik, chcę przeglądać listę moich ulubionych przekąsek.
- Kryteria akceptacji:
  - Użytkownik może przejść do widoku listy ulubionych przekąsek
  - Lista wyświetla wszystkie zapisane przez użytkownika przekąski
  - Każda pozycja na liście zawiera podstawowe informacje o przekąsce (nazwa, krótki opis)

US-009: Wyświetlenie szczegółów ulubionej przekąski
- Jako użytkownik przeglądający listę ulubionych, chcę zobaczyć szczegóły wybranej przekąski.
- Kryteria akceptacji:
  - Użytkownik może kliknąć na pozycję listy, aby wyświetlić szczegóły przekąski
  - Szczegóły zawierają pełne informacje: nazwę, opis, składniki, instrukcje i wartości odżywcze
  - Użytkownik może wrócić do listy ulubionych

US-010: Usunięcie przekąski z ulubionych
- Jako użytkownik przeglądający listę ulubionych, chcę usunąć wybraną przekąskę z listy.
- Kryteria akceptacji:
  - Przy każdej pozycji na liście dostępna jest opcja usunięcia
  - Użytkownik może kliknąć przycisk usunięcia, aby usunąć przekąskę z ulubionych
  - System wyświetla prośbę o potwierdzenie przed usunięciem
  - Po potwierdzeniu, przekąska zostaje usunięta z listy ulubionych

### Bezpieczeństwo

US-011: Ochrona danych osobowych
- Jako użytkownik, chcę mieć pewność, że moje dane osobowe są bezpiecznie przechowywane.
- Kryteria akceptacji:
  - Dane osobowe są przechowywane zgodnie z obowiązującymi przepisami o ochronie danych
  - Hasła są przechowywane w formie zahaszowanej
  - Dostęp do danych użytkownika jest możliwy tylko dla autoryzowanych osób

## 6. Metryki sukcesu
Sukces MVP aplikacji SnAIck będzie mierzony na podstawie następujących kryteriów:

1. Zaangażowanie użytkowników:
   - 80% zarejestrowanych użytkowników generuje co najmniej jedną propozycję przekąski
   - 60% zarejestrowanych użytkowników zapisuje co najmniej jedną przekąskę jako ulubioną

2. Efektywność głównego przepływu:
   - Wysoki wskaźnik ukończenia procesu od wypełnienia formularza do wygenerowania propozycji (>90%)
   - Niski wskaźnik odrzucenia propozycji i wygenerowania nowej (<50% przypadków)

3. Jakość propozycji:
   - Propozycje są zgodne z preferencjami i ograniczeniami wprowadzonymi przez użytkownika
   - Format propozycji jest spójny i zawiera wszystkie wymagane elementy

Wszystkie metryki będą mierzone na podstawie danych zbieranych w bazie danych aplikacji, bez konieczności wprowadzania dodatkowych narzędzi analitycznych na etapie MVP.