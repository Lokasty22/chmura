CZĘŚĆ OBOWIĄZKOWA  
1.  
W ramach zadania została zaimplementowana przykładowa aplikacja webowa w architekturze Full-Stack, uruchomiona i skonfigurowana w środowisku Kubernetes (klaster Minikube).
Aplikacja została udostępniona z zewnątrz klastra przy użyciu mechanizmu Ingress, pod adresem: http://brilliantapp.zad

Celem aplikacji jest analiza wpływu pandemii COVID-19 na sytuację gospodarczą oraz mobilność w krajach europejskich.
Aplikacja prezentuje dane w formie interaktywnych wykresów czasowych, umożliwiających porównanie wartości przed pandemią, w trakcie jej trwania oraz po jej zakończeniu.

Analizowane są dwa główne obszary:  
zadłużenie publiczne państw europejskich,  
ruch lotniczy (liczba lotów) jako wskaźnik mobilności i aktywności gospodarczej.  

Na wykresach wyraźnie zaznaczony jest moment wybuchu pandemii COVID-19 (rok 2020), który pokazuje gwałtowne zmiany trendów – wzrost zadłużenia publicznego oraz spadek liczby lotów. Dzięki temu aplikacja pozwala w sposób wizualny porównać sytuację przed pandemią i po jej wystąpieniu.  

Wybrany stack technologiczny:  
Aplikacja została zaimplementowana w oparciu o popularny stack typu MEAN, wymieniony na stronie W3Schools w sekcji Popular Stacks:  
MongoDB – baza danych przechowująca dane statystyczne,  
Express.js – backend REST API,  
Node.js – środowisko uruchomieniowe backendu,  
JavaScript – główny język programowania.  
W warstwie frontendowej zamiast AngularJS zastosowano React, który również znajduje się na liście technologii frontendowych W3Schools. Zmiana ta nie narusza idei stack-a Full-Stack, a umożliwia stworzenie nowoczesnego, interaktywnego interfejsu użytkownika.  

Implementacja w środowisku klastra Minikube:  
Aplikacja została w całości uruchomiona w klastrze Minikube, który symuluje środowisko produkcyjne Kubernetes na maszynie lokalnej.
Każda warstwa aplikacji została wdrożona jako osobny komponent klastra:  
backend i frontend uruchomione jako Deploymenty,  
baza danych MongoDB jako Deployment z PersistentVolumeClaim,  
komunikacja wewnątrz klastra zrealizowana przez Services typu ClusterIP,  
dostęp z zewnątrz klastra zapewniony przy użyciu Ingress (NGINX Ingress Controller).  

Kluczowe funkcjonalności aplikacji:  
Aplikacja umożliwia:  
wizualizację danych o zadłużeniu publicznym i liczbie lotów,  
analizę wpływu pandemii COVID-19 na gospodarkę i mobilność,  
wybór konkretnego państwa lub grupy państw,  
dynamiczną zmianę typu wykresów,  
pobieranie danych w formacie JSON,  
uwierzytelnianie użytkowników (rejestracja i logowanie).  

2-3.  
Pliki konfiguracyjne wdrożenia, uruchomienie wdrożenia oraz testy poprawności działania aplikacji.  
Uruchomienie klastra Minikube:
<img width="1039" height="334" alt="Screenshot from 2026-01-14 23-42-45" src="https://github.com/user-attachments/assets/785da2af-1325-4128-879b-79c030d32fec" />

Aktywacja kontrolera Ingress:
W celu umożliwienia dostępu do aplikacji z zewnątrz klastra, aktywowano dodatek Ingress NGINX:
<img width="1123" height="177" alt="Screenshot from 2026-01-14 23-44-02" src="https://github.com/user-attachments/assets/0387f717-152d-40d1-92ef-f4fdcca91a0e" />
Po włączeniu dodatku sprawdzono poprawność działania kontrolera Ingress w przestrzeni nazw ingress-nginx:
<img width="871" height="132" alt="Screenshot from 2026-01-14 23-44-12" src="https://github.com/user-attachments/assets/c141df24-cb36-4b86-988a-8a058478f373" />  
Kontroler Ingress został uruchomiony poprawnie i działa w stanie Running.

Budowa obrazów Docker dla aplikacji:  
Przed wdrożeniem aplikacji do klastra Kubernetes przygotowano obrazy Docker dla jej komponentów.  
W celu umożliwienia bezpośredniego wykorzystania lokalnie zbudowanych obrazów przez klaster Minikube, skonfigurowano środowisko Docker Minikube jako domyślne środowisko budowania obrazów:
eval $(minikube docker-env). Dzięki temu obrazy Docker są budowane bezpośrednio w rejestrze Dockera używanym przez Minikube.  
<img width="704" height="51" alt="Screenshot from 2026-01-14 23-48-27" src="https://github.com/user-attachments/assets/e93aa110-dccf-4e36-8ed3-ff59cb6a5469" />  
Następnie zbudowano obraz Docker dla backendu aplikacji, opartego na technologii Node.js + Express, który odpowiada za logikę biznesową oraz komunikację z bazą danych MongoDB.  
docker build -t zad2-backend:1.0 ./backend  
Obraz został oznaczony tagiem zad2-backend:1.0 i wykorzystany później w definicji obiektu Deployment w klastrze Kubernetes.  

Analogicznie przygotowano obraz Docker dla frontendowej części aplikacji, zbudowanej w oparciu o bibliotekę React.  
Frontend odpowiada za warstwę prezentacji, interakcję z użytkownikiem oraz komunikację z backendem poprzez REST API.  
docker build -t zad2-frontend:1.0 ./frontend  
<img width="708" height="54" alt="Screenshot from 2026-01-14 23-48-43" src="https://github.com/user-attachments/assets/4e3389e4-1dc4-4f22-854d-73087dd136f1" />  
W celu weryfikacji poprawności procesu budowy obrazów Docker wykonano polecenie:  
docker images | grep zad2  
Polecenie potwierdziło obecność lokalnych obrazów  
<img width="1088" height="106" alt="Screenshot from 2026-01-14 23-48-54" src="https://github.com/user-attachments/assets/02c93e99-428a-4730-bef1-413c7d725445" />

Zgodnie z treścią zadania aplikacja musi być dostępna pod adresem:  
http://brilliantapp.zad  
W tym celu:  
pobrano adres IP klastra Minikube,  
dodano wpis do pliku /etc/hosts.  
Komendy:  
minikube ip  
sudo nano /etc/hosts  
Dodany wpis:  
192.168.49.2 brilliantapp.zad  
<img width="396" height="48" alt="Screenshot from 2026-01-14 23-49-47" src="https://github.com/user-attachments/assets/a51616df-19d2-4883-ad98-3a157ac617c4" />  
<img width="424" height="38" alt="Screenshot from 2026-01-14 23-51-15" src="https://github.com/user-attachments/assets/d967dc11-fb4d-42da-81e6-b1835f23dccc" />  
<img width="772" height="303" alt="Screenshot from 2026-01-14 23-51-38" src="https://github.com/user-attachments/assets/a916043b-eed0-47e3-bb7a-fbc53fe2349e" />  

W celu logicznego odseparowania zasobów aplikacji od pozostałych komponentów klastra, utworzono dedykowaną przestrzeń nazw (Namespace) o nazwie brilliant.  
<img width="453" height="39" alt="Screenshot from 2026-01-14 23-54-07" src="https://github.com/user-attachments/assets/31708563-7e5a-429c-a7ba-cfc1a2686ed9" />  

Plik konfiguracyjny namespace.yaml:  
<img width="812" height="171" alt="Screenshot from 2026-01-14 23-54-17" src="https://github.com/user-attachments/assets/6de7aa0d-dcb4-4f2e-92d2-ee6fa8980e8d" />  

Namespace został utworzony poleceniem:  
kubectl apply -f namespace.yaml  
<img width="615" height="27" alt="Screenshot from 2026-01-14 23-54-48" src="https://github.com/user-attachments/assets/5c6cd687-d167-4efe-bc77-06a457ffbf7e" />  

Poprawność operacji zweryfikowano poleceniem:  
kubectl get ns  
<img width="435" height="76" alt="Screenshot from 2026-01-14 23-55-13" src="https://github.com/user-attachments/assets/70aa2063-d095-47d0-881d-6d8968e4088e" />  

PersistentVolumeClaim – trwałość danych MongoDB:  
W pierwszym kroku zdefiniowano zasób PersistentVolumeClaim, który odpowiada za trwałe przechowywanie danych bazy MongoDB.  
Dzięki temu dane nie są tracone w przypadku restartu poda lub ponownego wdrożenia aplikacji.  

Plik: mongo-pvc.yaml  
<img width="846" height="320" alt="Screenshot from 2026-01-14 23-59-08" src="https://github.com/user-attachments/assets/cfa0f0b8-4a50-4c8b-96ce-61dffe8acb6b" />

Deployment MongoDB:  
Następnie utworzono Deployment, który uruchamia pojedynczą replikę bazy danych MongoDB w klastrze.  
Kontener wykorzystuje oficjalny obraz mongo:4.4, a dane są zapisywane w katalogu /data/db, który jest podłączony do wcześniej zdefiniowanego PersistentVolumeClaim.  

Plik: mongo-deployment.yaml  
<img width="556" height="529" alt="Screenshot from 2026-01-15 00-00-04" src="https://github.com/user-attachments/assets/e8a56f23-89b6-4d2c-8213-d7db80e801d1" />  


Service MongoDB:
Aby umożliwić komunikację aplikacji backendowej z bazą danych, zdefiniowano zasób Service typu ClusterIP.  
Service udostępnia bazę MongoDB wewnątrz klastra pod nazwą mongo i porcie 27017.  

Plik: mongo-service.yaml  
<img width="626" height="255" alt="Screenshot from 2026-01-15 00-00-41" src="https://github.com/user-attachments/assets/8725846f-d4b8-4d7c-83f6-52bc9eb4dd88" />  

Wdrożenie analogicznie jak poprzednio:  
kubectl apply -f mongo-pvc.yaml  
kubectl apply -f mongo-deployment.yaml  
kubectl apply -f mongo-service.yaml  

ConfigMap – konfiguracja backendu:  
Plik: backend-config.yaml  
<img width="599" height="169" alt="Screenshot from 2026-01-15 00-06-27" src="https://github.com/user-attachments/assets/174408e8-615a-40cd-bcb2-b24e7f24bfb1" />  
W celu wydzielenia konfiguracji aplikacji backendowej zastosowano obiekt ConfigMap, który przechowuje:  
adres połączenia do bazy MongoDB (MONGODB_URI)  
parametr kryptograficzny SALT używany do hashowania haseł użytkowników  
Dzięki temu konfiguracja nie jest osadzona bezpośrednio w obrazie kontenera i może być łatwo zmieniana bez jego przebudowy.  

Wdrożenie:  
kubectl apply -f backend-config.yaml  

Deployment backendu:  
Plik: backend-deployment.yaml    
<img width="738" height="466" alt="image" src="https://github.com/user-attachments/assets/c13c4b2d-2ccf-4f4e-9650-869a1e11d083" />  

Backend aplikacji został wdrożony w klastrze Kubernetes jako Deployment z dwoma replikami, co zwiększa dostępność usługi.  
Zastosowano strategię RollingUpdate, która umożliwia aktualizację aplikacji bez przerywania jej działania.  
Kontener backendu:  
korzysta z obrazu zad2-backend:1.0  
nasłuchuje na porcie 3000  
pobiera konfigurację środowiskową z obiektu ConfigMap  

Wdrożenie:  
kubectl apply -f backend-deployment.yaml  

Service backendu:  
Plik: backend-service.yaml  
<img width="615" height="218" alt="Screenshot from 2026-01-15 00-04-55" src="https://github.com/user-attachments/assets/8b2c0186-26ae-4b60-8615-b4ae3fa714f6" />  

Aby umożliwić komunikację innych komponentów klastra z backendem, utworzono usługę typu ClusterIP.  
Service:  
wystawia backend wewnątrz klastra  
mapuje port 3000 kontenera  
umożliwia frontendowi komunikację z backendem po nazwie DNS backend  

Wdrożenie:  
kubectl apply -f backend-service.yaml  

Fronted-service: 
Plik frontend-service.yaml:  
<img width="646" height="222" alt="Screenshot from 2026-01-15 00-08-12" src="https://github.com/user-attachments/assets/aba95b0e-5c67-486f-97e2-a2def9d02bf8" />  

Dla warstwy frontendowej utworzono obiekt Service typu ClusterIP, który zapewnia wewnętrzną komunikację sieciową pomiędzy frontendem a pozostałymi komponentami aplikacji w klastrze Kubernetes.  
Usługa udostępnia frontend na porcie 80 wewnątrz klastra.  

Wdrożenie:  
kubectl apply -f frontend-service.yaml  

Frontend-deployment:  
Plik frontend-deployment.yaml:  
<img width="661" height="362" alt="Screenshot from 2026-01-15 00-07-33" src="https://github.com/user-attachments/assets/e80df501-886b-4982-83f4-e7cc1ca3e498" />  

Frontend aplikacji został wdrożony w klastrze Minikube jako obiekt Deployment z dwiema replikami w celu zwiększenia dostępności.  
Kontener frontendowy bazuje na obrazie zad2-frontend:1.0 i udostępnia aplikację na porcie 80.  

Wdrożenie:  
kubectl apply -f frontend-deployment.yaml  

Ingress – udostępnienie aplikacji na zewnątrz:  
Plik ingress.yaml:  
<img width="581" height="431" alt="Screenshot from 2026-01-15 00-08-41" src="https://github.com/user-attachments/assets/8f851ef7-36c9-4dac-8011-958b6c347596" />  

W celu udostępnienia aplikacji poza klastrem Minikube skonfigurowano obiekt Ingress z wykorzystaniem kontrolera NGINX Ingress Controller.  
Ruch HTTP kierowany na domenę http://brilliantapp.zad jest rozdzielany na podstawie ścieżki:  
zapytania rozpoczynające się od /api są przekazywane do usługi backend,  
pozostały ruch (/) jest obsługiwany przez usługę frontend.  

Wdrożenie:  
kubectl apply -f ingress.yaml  

Test 1 – rejestracja użytkownika (Backend API)  
Na poniższym screenie przedstawiono test poprawności działania backendu poprzez wysłanie żądania POST do endpointu rejestracji użytkownika:  
POST http://brilliantapp.zad/api/users  
<img width="864" height="264" alt="Screenshot from 2026-01-15 00-10-08" src="https://github.com/user-attachments/assets/d1e1a0fd-5c9b-47c9-bcb1-4db73ac0905d" />  

Żądanie zostało wysłane za pomocą narzędzia curl i zawierało dane nowego użytkownika w formacie JSON.  
Odpowiedź serwera HTTP 201 Created potwierdza poprawne utworzenie użytkownika w systemie.  

Test 2 – logowanie użytkownika (uwierzytelnianie)  
Kolejny screen przedstawia test logowania użytkownika poprzez endpoint:  
POST http://brilliantapp.zad/api/auth  
<img width="998" height="308" alt="Screenshot from 2026-01-15 00-10-52" src="https://github.com/user-attachments/assets/28970837-99f6-4fcc-abb8-9f5d9e104de0" />  

W odpowiedzi serwer zwrócił status HTTP 200 OK oraz token JWT, co oznacza poprawne uwierzytelnienie użytkownika.  

Test 3 – weryfikacja danych w bazie MongoDB (PersistentVolumeClaim)  
Na tym screenie pokazano bezpośrednie połączenie z bazą MongoDB działającą w klastrze Kubernetes:  
kubectl exec -it -n brilliant mongo-... -- mongo  
<img width="1127" height="525" alt="Screenshot from 2026-01-15 00-14-07" src="https://github.com/user-attachments/assets/ac38f203-6d13-4170-b4d7-5a06c1466eaf" />  

Po połączeniu:  
wyświetlono dostępne bazy danych,  
wybrano bazę Projekt,  
sprawdzono kolekcje,  
odczytano dane użytkowników poleceniem db.users.find().  

Testy poprawności działania aplikacji (interfejs użytkownika):  
Na poniższych ekranach przedstawiono końcowy etap testów poprawności działania aplikacji udostępnionej w klastrze Minikube pod adresem http://brilliantapp.zad.  
Zaprezentowano ekran logowania użytkownika, który umożliwia uwierzytelnienie przy użyciu adresu e-mail oraz hasła. Po zalogowaniu użytkownik uzyskuje dostęp do interaktywnych wykresów.  
<img width="1209" height="729" alt="Screenshot from 2026-01-15 00-14-39" src="https://github.com/user-attachments/assets/307911c3-1552-42b7-85a9-831fcf7da815" />  
<img width="1209" height="729" alt="Screenshot from 2026-01-15 00-15-09" src="https://github.com/user-attachments/assets/d3009d7a-e459-491b-b407-a1456bd732d2" />  
<img width="1209" height="729" alt="Screenshot from 2026-01-15 00-15-26" src="https://github.com/user-attachments/assets/edb4506f-110f-403a-9111-c5aca6cb3e1b" />  










