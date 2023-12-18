export const DUMMY_PRESCRIPTIONS = [
    {
        id: 1,
        numer: 101,
        data_wystawienia: '2023-01-05',
        nazwa_leku: 'Aspirin',
        dawka: 75.5,
        liczba_opakowan: 2,
        id_wizyty: 401,
    },
    {
        id: 2,
        numer: 102,
        data_wystawienia: '2023-02-10',
        nazwa_leku: 'Paracetamol',
        dawka: 50.0,
        liczba_opakowan: 3,
        id_wizyty: 402,
    },
    {
        id: 3,
        numer: 103,
        data_wystawienia: '2023-03-15',
        nazwa_leku: 'Ibuprofen',
        dawka: 100.25,
        liczba_opakowan: 1,
        id_wizyty: 403,
    },
    {
        id: 4,
        numer: 104,
        data_wystawienia: '2023-04-20',
        nazwa_leku: 'Antibiotic',
        dawka: 125.0,
        liczba_opakowan: 2,
        id_wizyty: 404,
    },
    {
        id: 5,
        numer: 105,
        data_wystawienia: '2023-05-25',
        nazwa_leku: 'Cough Syrup',
        dawka: 30.75,
        liczba_opakowan: 1,
        id_wizyty: 405,
    },
];

export const DUMMY_VACCINATIONS = [
    {
        id: 1,
        rodzaj_szczepionki: 'COVID-19',
        nr_seryjny: 1001,
        data_podania: '2022-05-15',
        data_waznosci: '2023-05-15',
        opis: 'First dose',
        id_wizyty: 501,
    },
    {
        id: 2,
        rodzaj_szczepionki: 'Influenza',
        nr_seryjny: 1002,
        data_podania: '2022-10-10',
        data_waznosci: '2023-10-10',
        opis: 'Annual flu shot',
        id_wizyty: 502,
    },
    {
        id: 3,
        rodzaj_szczepionki: 'Hepatitis B',
        nr_seryjny: 1003,
        data_podania: '2022-12-01',
        data_waznosci: '2023-12-01',
        opis: 'Booster shot',
        id_wizyty: 503,
    },
    {
        id: 4,
        rodzaj_szczepionki: 'Measles, Mumps, Rubella',
        nr_seryjny: 1004,
        data_podania: '2023-02-20',
        data_waznosci: '2024-02-20',
        opis: 'Second dose',
        id_wizyty: 504,
    },
    {
        id: 5,
        rodzaj_szczepionki: 'Pneumococcal',
        nr_seryjny: 1005,
        data_podania: '2023-04-05',
        data_waznosci: '2024-04-05',
        opis: 'Elderly vaccination',
        id_wizyty: 505,
    },
];

export const DUMMY_TREATMENTS = [
    {
        id: 1,
        rodzaj: 'Dental Extraction',
        data_zabiegu: '2023-01-15',
        opis: 'Extracted a damaged tooth',
        id_wizyty: 501,
    },
    {
        id: 2,
        rodzaj: 'MRI Scan',
        data_zabiegu: '2023-02-20',
        opis: 'Performed brain MRI for diagnostic purposes',
        id_wizyty: 502,
    },
    {
        id: 3,
        rodzaj: 'Appendectomy',
        data_zabiegu: '2023-03-25',
        opis: 'Surgical removal of the appendix',
        id_wizyty: 503,
    },
    {
        id: 4,
        rodzaj: 'LASIK Surgery',
        data_zabiegu: '2023-04-30',
        opis: 'Laser eye surgery for vision correction',
        id_wizyty: 504,
    },
    {
        id: 5,
        rodzaj: 'Colonoscopy',
        data_zabiegu: '2023-06-05',
        opis: 'Screening procedure for colorectal health',
        id_wizyty: 505,
    },
];

export const DUMMY_SICKNESSES = [
    {
        "id": 1,
        "choroba": "Flu",
        "uwagi": "Mild symptoms, recommended rest",
        "data": "2023-01-15",
        "id_pacjenta": 101
    },
    {
        "id": 2,
        "choroba": "Allergy",
        "uwagi": "Prescribed antihistamines",
        "data": "2023-02-20",
        "id_pacjenta": 102
    },
    {
        "id": 3,
        "choroba": "Injury",
        "uwagi": "Recommend rest and painkillers",
        "data": "2023-03-10",
        "id_pacjenta": 103
    },
    {
        "id": 4,
        "choroba": "Cold",
        "uwagi": "Patient should stay hydrated",
        "data": "2023-04-05",
        "id_pacjenta": 104
    },
    {
        "id": 5,
        "choroba": "Fever",
        "uwagi": "Suggested complete bed rest",
        "data": "2023-05-12",
        "id_pacjenta": 105
    }
]
