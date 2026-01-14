
W ramach zadania została zaimplementowana przykładowa aplikacja webowa w architekturze Full-Stack, uruchomiona i skonfigurowana w środowisku Kubernetes (klaster Minikube).
Aplikacja została udostępniona z zewnątrz klastra przy użyciu mechanizmu Ingress, pod adresem:http://brilliantapp.zad

Celem aplikacji jest analiza wpływu pandemii COVID-19 na sytuację gospodarczą oraz mobilność w krajach europejskich.
Aplikacja prezentuje dane w formie interaktywnych wykresów czasowych, umożliwiających porównanie wartości przed pandemią, w trakcie jej trwania oraz po jej zakończeniu.

Analizowane są dwa główne obszary:

zadłużenie publiczne państw europejskich,

ruch lotniczy (liczba lotów) jako wskaźnik mobilności i aktywności gospodarczej.

Na wykresach wyraźnie zaznaczony jest moment wybuchu pandemii COVID-19 (rok 2020), który pokazuje gwałtowne zmiany trendów – wzrost zadłużenia publicznego oraz spadek liczby lotów. Dzięki temu aplikacja pozwala w sposób wizualny porównać sytuację przed pandemią i po jej wystąpieniu.

Wybrany stack technologiczny

Aplikacja została zaimplementowana w oparciu o popularny stack typu MEAN, wymieniony na stronie W3Schools w sekcji Popular Stacks:

MongoDB – baza danych przechowująca dane statystyczne,

Express.js – backend REST API,

Node.js – środowisko uruchomieniowe backendu,

JavaScript – główny język programowania.

W warstwie frontendowej zamiast AngularJS zastosowano React, który również znajduje się na liście technologii frontendowych W3Schools. Zmiana ta nie narusza idei stack-a Full-Stack, a umożliwia stworzenie nowoczesnego, interaktywnego interfejsu użytkownika.

Implementacja w środowisku klastra Minikube

Aplikacja została w całości uruchomiona w klastrze Minikube, który symuluje środowisko produkcyjne Kubernetes na maszynie lokalnej.
Każda warstwa aplikacji została wdrożona jako osobny komponent klastra:

backend i frontend uruchomione jako Deploymenty,

baza danych MongoDB jako Deployment z PersistentVolumeClaim,

komunikacja wewnątrz klastra zrealizowana przez Services typu ClusterIP,

dostęp z zewnątrz klastra zapewniony przy użyciu Ingress (NGINX Ingress Controller).

Kluczowe funkcjonalności aplikacji

Aplikacja umożliwia:

wizualizację danych o zadłużeniu publicznym i liczbie lotów,

analizę wpływu pandemii COVID-19 na gospodarkę i mobilność,

wybór konkretnego państwa lub grupy państw,

dynamiczną zmianę typu wykresów,

pobieranie danych w formacie JSON,

uwierzytelnianie użytkowników (rejestracja i logowanie).
