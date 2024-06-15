import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CookiesProvider } from "react-cookie";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      lv: {
        translation: {
          "Categories": "Kategorijas",
          "About us": "Par mums",
          "Favorite": "Mīļākie",
          "Create advertisement": "Izveidot sludinājumu",
          "Profile": "Profils",
          "Log out": "Iziet",
          "Sign Up": "Reģistrēties",
          "Filters": "Filtri",
          "Filter": "Filtrēt",
          "Create": "Izveidot",
          "Advertisements not found": "Sludinājumi nav atrasti",
          "Details": "Detaļas",
          "Remove from favorite": "Noņemt no favorītiem",
          "Save to favorite": "Saglabāt favorītos",
          "Edit": "Rediģēt",
          "Delete": "Dzēst",
          "No image": "Nav attēla",
          "Seller": "Pārdevējs",
          "Posted at": "Publicēts",
          "No image": "Nav attēla",
          "Views": "Skatījumi",
          "View": "Skatīt",
          "Open statistics": "Atvērt statistiku",
          "Name": "Nosaukums",
          "Name_user": "Vārds",
          "Price": "Cena",
          "Description": "Apraksts",
          "Avatar": "Avatars",
          "Attribute": "Atribūts",
          "Attributes": "Atribūti",
          "Remove": "Noņemt",
          "Images": "Attēli",
          "Add": "Pievienot",
          "Add image": "Pievienot attēlu",
          "Add attribute": "Pievienot atribūtu",
          "Save": "Saglabāt",
          "Home": "Sākums",
          "Email": "E-pasts",
          "Password": "Parole",
          "Sign In": "Pieteikties",
          "OR": "VAI",
          "Advertisement number": "Sludinājuma numurs",
          "Attribute name": "Atribūta nosaukums",
          "Email is required": "E-pasts ir nepieciešams",
          "Password is required": "Parole ir nepieciešama",
          "Create section": "Izveidot sadaļu",
          "Rename": "Parnosaukt",
          "No attributes": "Nav atribūtu",
          "Categories not found": "Kategorijas nav atrastas",
          "Choose category": "Izvēlieties kategoriju",
          "Change": "Mainīt",
          "Close": "Aizvērt",
          "Created at": "Izveidots",
          "Total views": "Kopējie skatījumi",
          "Authorized users views": "Autorizēto lietotāju skatījumi",
          "Guests views": "Viesu skatījumi",
          "Guests views in last month": "Viesu skatījumi pēdējā mēnesī",
          "Download PDF": "Lejupielādēt PDF",
          "Incorrect code": "Nepareizs kods",
          "Incorrect old password": "Nepareiza vecā parole",
          "Code": "Kods",
          "Submit": "Iesniegt",
          "Old password": "Vecā parole",
          "New password": "Jaunā parole",
          "Enter new password": "Ievadiet jauno paroli",
          "Enter old password": "Ievadiet veco paroli",
          "Enter": "Ievadiet",
          "Search": "Meklēt",
          "Clear": "Notīrīt",
          "View Type": "Skata tips",
          "Table": "Tabula",
          "Card": "Karte",
          "Sort": "Kārtot",
          "Newest": "Jaunākie",
          "Oldest": "Vecākie",
          "Price high to low": "Cena augošā secībā",
          "Price low to high": "Cena dilstošā secībā",
          "Name ascending": "Vārds augošā secībā",
          "Name descending": "Vārds dilstošā secībā",
          "Select": "Izvēlieties",
          "Statistics for advertisement": "Sludinājuma statistika",
          "Date": "Datums",
          "Value": "Vērtība",
          "Profile Stats": "Profila statistika",
          "Profile statistics": "Profila statistika",
          "Active advertisements": "Aktīvie sludinājumi",
          "Users count saved ads to favorite": "Lietotāju skaits, kas saglabāja sludinājumus favorītos",
          "Views in last month": "Skatījumi pēdējā mēnesī",
          "Authorized views in last month": "Autorizētie skatījumi pēdējā mēnesī",
          "Category statistics": "Kategorijas statistika",
          "Stats": "Statistika",
          "Section statistics": "Sadaļas statistika",
          "Invalid email": "Nepareizs e-pasta formāts",
          "Password mismatch": "Paroles nesakrīt",
          "Introduction": "Ievads",
          "Our Mission": "Mūsu misija",
          "Our Vision": "Mūsu redzējums",
          "Welcome to Ads Marketplace - your one-stop solution for all advertising needs. At Ads Marketplace, we bridge the gap between businesses looking to advertise and platforms offering advertising space, making the process seamless, efficient, and effective.": "Laipni lūdzam Ads Marketplace - jūsu vienīgajā risinājumā visiem reklāmas vajadzībām. Ads Marketplace mēs savienojam uzņēmumus, kuri vēlas reklamēties, un platformas, kas piedāvā reklāmas vietu, padarot procesu vienkāršu, efektīvu un efektīvu.",
          "Our mission is to revolutionize the advertising industry by providing a comprehensive and user-friendly portal that caters to all your advertising requirements. We aim to empower businesses of all sizes to reach their target audience effectively and affordably.": "Mūsu misija ir revolucionēt reklāmas nozari, nodrošinot visaptverošu un lietotājam draudzīgu portālu, kas apmierina visas jūsu reklamēšanas prasības. Mēs cenšamies dot iespēju visu izmēru uzņēmumiem efektīvi un pieejami sasniegt savu mērķauditoriju.",
          "We envision a world where advertising is accessible, transparent, and measurable. By leveraging technology, we strive to create a marketplace that offers diverse advertising opportunities, ensuring businesses can find the perfect match for their marketing campaigns.": "Mēs iedomājamies pasauli, kur reklāma ir pieejama, pārredzama un mērāma. Izmantojot tehnoloģijas, mēs cenšamies izveidot tirgu, kas piedāvā dažādas reklāmas iespējas, nodrošinot, ka uzņēmumi var atrast ideālu atbilstību savām mārketinga kampaņām.",
          "What We Offer": "Ko mēs piedāvājam",
          "User-Friendly Interface: Our portal is designed to be intuitive and easy to navigate, ensuring a hassle-free experience for users.": "Lietotājam draudzīga saskarne: mūsu portāls ir izstrādāts tā, lai būtu intuitīvs un viegli pārvietojams, nodrošinot lietotājiem bezrūpīgu pieredzi.",
          "Affordable Solutions: We offer competitive pricing models to suit businesses of all budgets.": "Pieejamas risinājumi: mēs piedāvājam konkurētspējīgus cenu modeļus, kas piemēroti visu budžetu uzņēmumiem.",
          "Analytics and Reporting: Our advanced analytics tools help you track the performance of your ads in real-time.": "Analītika un atskaišu sagatavošana: mūsu uzlabotie analītikas rīki palīdz jums reāllaikā sekot līdzi jūsu reklāmu veiktspējai.",
        }
      }
    },
    lng: "lv",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  // </React.StrictMode>
);
