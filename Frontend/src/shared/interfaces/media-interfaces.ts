export interface Film {}

export interface SeasonEpisode {
  id: number;
  tmdbEpisodeID: number;
  name: string;
  overview: string;
  episodeNumber: number;
  runtime: number;
  airDate: string;
  stillPath: string;
}

export interface SeasonWithEpisodes {
  id: number;
  tmdbSeasonID: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string;
  episodeCount: number;
  posterPath: string;
  episodes: SeasonEpisode[];
}

export interface Season {
  id: number;
  tmdbID: number;
  imdbID: string;
  originalName: string;
  name: string;
  description: string;
  firstAirDate: string;
  tmdbGenres: { id: number; tmdbGenreID: number; name: string }[];
  seasons: SeasonWithEpisodes[];
  type: string;
  posterPath: string;
  backdropPath: string;
  mediaID: string | null;
}

/**
 * {
    "id": 2,
    "tmdbID": 127532,
    "imdbID": "tt21209876",
    "originalName": "\u4ffa\u3060\u3051\u30ec\u30d9\u30eb\u30a2\u30c3\u30d7\u306a\u4ef6",
    "name": "Solo Leveling",
    "description": "Vor \u00fcber einem Jahrzehnt erschienen pl\u00f6tzlich \u201eGates\u201c \u2013 Pfade, die die reale Welt mit einer anderen Dimension verbinden. Seitdem sind einige Menschen mit \u00fcbernat\u00fcrlichen Kr\u00e4ften erwacht. Diese sogenannten Hunter verdienen ihren Lebensunterhalt, indem sie ihre Kr\u00e4fte einsetzen, um die Dungeons innerhalb der Gates zu erobern. In dieser Welt ist der rangniedrige Hunter Jin-Woo Sung als der \u201eschw\u00e4chste Hunter der ganzen Menschheit\u201c bekannt. Eines Tages wird er t\u00f6dlich verletzt, als er einen hochrangigen Dungeon zu erobern versucht und in diesem Moment erscheint ein mysteri\u00f6ses Questfenster vor ihm. Am Rande des Todes beschlie\u00dft Jin-Woo, die Quest anzunehmen, im Rang aufzusteigen und sich an die Spitze der Hunter zu k\u00e4mpfen.",
    "firstAirDate": "2024-01-07T19:16:28+00:00",
    "tmdbGenres": [
        {
            "id": 1,
            "tmdbGenreID": 10759,
            "name": "Action \u0026 Adventure"
        },
        {
            "id": 2,
            "tmdbGenreID": 16,
            "name": "Animation"
        },
        {
            "id": 12,
            "tmdbGenreID": 10765,
            "name": "Sci-Fi \u0026 Fantasy"
        }
    ],
    "seasons": [
        {
            "id": 1,
            "tmdbSeasonID": 199167,
            "seasonNumber": 1,
            "name": "Staffel 1",
            "overview": "",
            "airDate": "2024-01-07T19:16:28+00:00",
            "episodeCount": 25,
            "posterPath": "\/451lpwzbSKClDUHmKxOcBboBf7E.jpg",
            "episodes": [
                {
                    "id": 1,
                    "tmdbEpisodeID": 3026285,
                    "name": "Ich bin es bereits gewohnt",
                    "overview": "Jin-Woo Sung ist als schw\u00e4chster Hunter bekannt und muss dementsprechend einiges Gerede seiner Hunter-Kollegen \u00fcber sich ergehen lassen. Doch Ju-Hee Lee, eine junge Heilerin, ist stets um ihn besorgt und hilft ihm, Anschluss zu finden.",
                    "episodeNumber": 1,
                    "runtime": 24,
                    "airDate": "2024-01-07T19:16:28+00:00",
                    "stillPath": "\/2rjil078wSfnjqdpELrMxwn6zxk.jpg"
                },
                {
                    "id": 2,
                    "tmdbEpisodeID": 4888539,
                    "name": "Wenn ich doch nur eine weitere Chance h\u00e4tte",
                    "overview": "Der D-Rang-Dungeon hat sich als doppelter Dungeon entpuppt. Jin-Woo und seine Kameraden sitzen fest und m\u00fcssen tatenlos mitansehen, wie die Steinstatue einen nach dem anderen abmetzelt. Doch es scheint ein Entrinnen aus diesem perfiden Spiel zu geben. Doch zu welchem Preis?",
                    "episodeNumber": 2,
                    "runtime": 24,
                    "airDate": "2024-01-14T19:16:28+00:00",
                    "stillPath": "\/ch5o2NnATbswomEiCugOgjX8IwY.jpg"
                },
                {
                    "id": 3,
                    "tmdbEpisodeID": 4987144,
                    "name": "Das ist ja wie in einem Game",
                    "overview": "Jin-Woo erwacht zu seiner \u00dcberraschung wohlbehalten im Krankenhaus. Zun\u00e4chst h\u00e4lt er die grausigen Ereignisse f\u00fcr einen Traum, doch die Statusbildschirme wollen einfach nicht verschwinden und scheinen f\u00fcr sonst niemanden sichtbar zu sein. Seinem wundersamen \u00dcberleben widmet sich die Aufsichtsabteilung der Hunter-Vereinigung.",
                    "episodeNumber": 3,
                    "runtime": 24,
                    "airDate": "2024-01-21T19:16:28+00:00",
                    "stillPath": "\/3h4QyKMODJiOQKqfuL4NrehcV43.jpg"
                },
                {
                    "id": 4,
                    "tmdbEpisodeID": 4996492,
                    "name": "Ich muss st\u00e4rker werden",
                    "overview": "Jin-Woo ist innerhalb der Dungeon-Instanz gefangen. Er muss entweder den Dungeon kl\u00e4ren oder mit einem R\u00fcckkehrstein den Dungeon verlassen. Da er solch einen R\u00fcckkehrstein nicht besitzt, bleibt ihm nur der Kampf. Dabei erforscht er nicht nur den Dungeon, sondern auch das Levelsystem mit all seinen Vorz\u00fcgen.",
                    "episodeNumber": 4,
                    "runtime": 24,
                    "airDate": "2024-01-28T19:16:28+00:00",
                    "stillPath": "\/2zbHJNbyuGEdyGVOyJpv24qgf2w.jpg"
                },
                {
                    "id": 5,
                    "tmdbEpisodeID": 4996493,
                    "name": "Ein ziemlich guter Deal",
                    "overview": "Jin-Woos Entlassung aus dem Krankenhaus steht unmittelbar bevor. Doch er verl\u00e4sst das Krankenhaus deutlich fitter als jemals zuvor. Das bleibt auch bei den Krankenschwestern nicht unbemerkt.",
                    "episodeNumber": 5,
                    "runtime": 24,
                    "airDate": "2024-02-04T19:16:28+00:00",
                    "stillPath": "\/vPpiI1sKgiJgWykydYzOf2XfCcR.jpg"
                },
                {
                    "id": 6,
                    "tmdbEpisodeID": 4996494,
                    "name": "Die wahre Jagd beginnt",
                    "overview": "Die Schlinge um Jin-Woos und Jin-Hos Hals zieht sich zu. Sie sind mit der Riesenspinne alleine im Boss-Raum gefangen und stehen vor der Entscheidung, ob sie fliehen oder k\u00e4mpfen sollen.",
                    "episodeNumber": 6,
                    "runtime": 24,
                    "airDate": "2024-02-11T19:16:28+00:00",
                    "stillPath": "\/jeyh5o40BjSmkYxv1FV7OMqJn9m.jpg"
                },
                {
                    "id": 7,
                    "tmdbEpisodeID": 4996495,
                    "name": "Dann teste ich doch mal meine Grenzen aus",
                    "overview": "Nach dem Vorfall im C-Rang-Dungeon geht Jin-Woo gewohnt seinem Alltag nach. Seine Schwester Jin-Ah kann seine Entwicklung nicht ganz fassen. Schlie\u00dflich kontaktiert Jin-Ho Jin-Woo und m\u00f6chte ihm ein verf\u00fchrerisches Angebot unterbreiten.",
                    "episodeNumber": 7,
                    "runtime": 24,
                    "airDate": "2024-02-18T19:16:28+00:00",
                    "stillPath": "\/3UGTVLFHcAIQgjolx6rQpCottRj.jpg"
                },
                {
                    "id": 8,
                    "tmdbEpisodeID": 4996496,
                    "name": "Das ist so frustrierend",
                    "overview": "Nach seinem letzten Ausflug in eine Dungeon-Instanz ist sich Jin-Woo seiner eigenen Schw\u00e4che gewahr geworden. Zu diesem Zweck will er leveln und das m\u00f6glichst schnell. Doch das funktioniert nur, wenn er irgendwie in Dungeons kommt.",
                    "episodeNumber": 8,
                    "runtime": 24,
                    "airDate": "2024-03-03T19:16:28+00:00",
                    "stillPath": "\/mYoah2DtfKVqGMtuCBmgeZYCQoM.jpg"
                },
                {
                    "id": 9,
                    "tmdbEpisodeID": 4996497,
                    "name": "Du hast dein Talent unter dem Scheffel gehalten",
                    "overview": "Zusammen mit Kang von der Aufsichtsabteilung der Hunter-Vereinigung und drei H\u00e4ftlingen geht es in den Dungeon. Dieser stellt sich als recht einfach heraus, sodass sich die Gruppe aufgeteilt, um die Arbeit schneller zu verrichten. Doch die wahre Gefahr geht dieses Mal nicht vom Dungeon selbst aus.",
                    "episodeNumber": 9,
                    "runtime": 24,
                    "airDate": "2024-03-10T19:16:28+00:00",
                    "stillPath": "\/e740cGwsp7JWs19CgWTp0uBDPMp.jpg"
                },
                {
                    "id": 10,
                    "tmdbEpisodeID": 4996498,
                    "name": "Soll das ein Picknick sein?",
                    "overview": "Jin-Ho stellt eine passende Gruppe f\u00fcr die C-Rang-Raids aus, die er zusammen mit Jin-Woo bestreiten m\u00f6chte. Dabei schnappen sie jedoch anderen Gilden die Gates weg und geraten so ins Visier der der Wei\u00dfer-Tiger-Gilde.",
                    "episodeNumber": 10,
                    "runtime": 24,
                    "airDate": "2024-03-17T19:16:28+00:00",
                    "stillPath": "\/anFjSYbyhwOntz31Qr0Egl9qnGz.jpg"
                },
                {
                    "id": 11,
                    "tmdbEpisodeID": 4996499,
                    "name": "Ein Ritter, der einen leeren Thron besch\u00fctzt",
                    "overview": "Jin-Woo stellt sich der Job-Wechsel-Quest, die sich als gro\u00dfe Herausforderung herausstellt. In der Zwischenzeit f\u00fchrt Jong-In Choi seine geplante Aufkl\u00e4rungsmission auf der Insel Jeju durch.",
                    "episodeNumber": 11,
                    "runtime": 24,
                    "airDate": "2024-03-24T19:16:28+00:00",
                    "stillPath": "\/xwTGcW5n6CdxW8SfipWiQzz40RO.jpg"
                },
                {
                    "id": 12,
                    "tmdbEpisodeID": 4996500,
                    "name": "Erhebt euch",
                    "overview": "Die Job-Wechsel-Quest ist f\u00fcr Jin-Woo quasi unschaffbar. Selbstzweifel \u00fcberkommen ihn und er h\u00f6rt die d\u00fcsteren Stimmen der Vergangenheit.",
                    "episodeNumber": 12,
                    "runtime": 24,
                    "airDate": "2024-03-30T19:16:28+00:00",
                    "stillPath": "\/6kjROrp76VDJyfImdqUzmL7zdJM.jpg"
                },
                {
                    "id": 13,
                    "tmdbEpisodeID": 5876034,
                    "name": "Du bist gar nicht auf dem E-Rang, oder?",
                    "overview": "Jin-Woo verpennt fast den Elternsprechtag seiner kleinen Schwester Jin-Ah. Dort stellt ihre Klassenlehrerin eine ungew\u00f6hnliche Bitte: Er soll ein Auge auf Song-Yi und ihre Hunter-Ambitionen haben. Welch Zufall, dass genau passend ein verlockendes Angebot reinkommt.",
                    "episodeNumber": 13,
                    "runtime": 24,
                    "airDate": "2025-01-05T19:16:28+00:00",
                    "stillPath": "\/frSnFbURT5Ge3G2q0feAGeEwiTx.jpg"
                },
                {
                    "id": 14,
                    "tmdbEpisodeID": 5876038,
                    "name": "Das war dir wohl nicht bewusst",
                    "overview": "Gefangen im Red Gate teilt sich die Gruppe auf und Jin-Woo wird zum Anf\u00fchrer des Bodensatzes, den Chul Kim f\u00fcr das \u00dcberleben der Mehrheit aufgegeben hat. F\u00fcr den A-Rang-Hunter l\u00e4uft allerdings so gar nichts nach Plan, w\u00e4hrend sein Gildenchef vor dem Gate eine ganz eigene Schlacht schlagen muss.",
                    "episodeNumber": 14,
                    "runtime": 24,
                    "airDate": "2025-01-12T19:16:28+00:00",
                    "stillPath": "\/4Tx3dVSvDpLenny0FtWgqxT3st8.jpg"
                },
                {
                    "id": 15,
                    "tmdbEpisodeID": 5891808,
                    "name": "Es liegt noch ein langer Weg vor mir",
                    "overview": "Jin-Woo hat Jin-Ho geholfen, sein Ziel zu erreichen. Dies verschafft ihm nun die M\u00f6glichkeit, sich erneut der Festung des Teufels zu stellen.",
                    "episodeNumber": 15,
                    "runtime": 24,
                    "airDate": "2025-01-19T19:16:28+00:00",
                    "stillPath": "\/ksoMkIBX9HxzvShzOxUvi4WhlFj.jpg"
                },
                {
                    "id": 16,
                    "tmdbEpisodeID": 5891809,
                    "name": "Ich muss aufh\u00f6ren, anderen nur etwas vorzuspielen",
                    "overview": "Jin-Woo beschlie\u00dft, dass es so nicht weitergehen kann und macht einen entscheidenden Schritt: Die Neueinstufung seines Hunter-Ranges.",
                    "episodeNumber": 16,
                    "runtime": 24,
                    "airDate": "2025-01-26T19:16:28+00:00",
                    "stillPath": "\/yaaTlWhfJOJjKDbZZRTabnb6Mxm.jpg"
                },
                {
                    "id": 17,
                    "tmdbEpisodeID": 5891811,
                    "name": "Daf\u00fcr wurden wir ausgebildet",
                    "overview": "Aus Jin-Woos Job bei der Abbaueinheit wurde unerwartet ein Job als Gep\u00e4cktr\u00e4ger f\u00fcr einen A-Rang-Raid.",
                    "episodeNumber": 17,
                    "runtime": 24,
                    "airDate": "2025-02-02T19:16:28+00:00",
                    "stillPath": "\/mfztqiGjHPmHBUNok763a1rDsVn.jpg"
                },
                {
                    "id": 18,
                    "tmdbEpisodeID": 5891813,
                    "name": "Schau nicht auf meine Leute herab",
                    "overview": "Kargalgan l\u00e4dt seine G\u00e4ste in seine Hallen, allerdings bl\u00fcht ihnen dort kein sch\u00f6nes Ende. Zeit f\u00fcr Jin-Woo, einzuschreiten.",
                    "episodeNumber": 18,
                    "runtime": 24,
                    "airDate": "2025-02-09T19:16:28+00:00",
                    "stillPath": "\/byJcQpCL4XiTwEl4pMG2HaT2bkr.jpg"
                },
                {
                    "id": 19,
                    "tmdbEpisodeID": 5891814,
                    "name": "Der zehnte S-Rang-Hunter",
                    "overview": "",
                    "episodeNumber": 19,
                    "runtime": 0,
                    "airDate": "2025-02-16T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 20,
                    "tmdbEpisodeID": 5891815,
                    "name": "Episode 20",
                    "overview": "",
                    "episodeNumber": 20,
                    "runtime": 0,
                    "airDate": "2025-02-23T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 21,
                    "tmdbEpisodeID": 5891816,
                    "name": "Episode 21",
                    "overview": "",
                    "episodeNumber": 21,
                    "runtime": 0,
                    "airDate": "2025-03-02T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 22,
                    "tmdbEpisodeID": 5891817,
                    "name": "Episode 22",
                    "overview": "",
                    "episodeNumber": 22,
                    "runtime": 0,
                    "airDate": "2025-03-09T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 23,
                    "tmdbEpisodeID": 5891818,
                    "name": "Episode 23",
                    "overview": "",
                    "episodeNumber": 23,
                    "runtime": 0,
                    "airDate": "2025-03-16T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 24,
                    "tmdbEpisodeID": 5891819,
                    "name": "Episode 24",
                    "overview": "",
                    "episodeNumber": 24,
                    "runtime": 0,
                    "airDate": "2025-03-23T19:16:28+00:00",
                    "stillPath": null
                },
                {
                    "id": 25,
                    "tmdbEpisodeID": 5891820,
                    "name": "Episode 25",
                    "overview": "",
                    "episodeNumber": 25,
                    "runtime": 0,
                    "airDate": "2025-03-30T19:16:28+00:00",
                    "stillPath": null
                }
            ]
        }
    ],
    "type": "tv",
    "posterPath": "\/1KRSR1dUAOpUv3mxHU5W3QWo2og.jpg",
    "backdropPath": "\/odVlTMqPPiMksmxpN9cCbPCjUPP.jpg"
}
 */

export interface TV {
  // tv series
  seasons: Season[];
}

export interface MediaResult {
  // attention: title is only available in movies and name only in tv
  backdrop_path: string;
  id: number;
  name: string;
  title: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export interface MultiSearchResponse {
  page: number;
  results: MediaResult[];
  total_results: 3;
  total_pages: 1;
}

export interface TrackListCreation {
  name: string;
  tmdbId: number;
}
