export default function migrations() {
  return [
    {
      table: "motives",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        name: "TEXT NOT NULL",
        social: "INTEGER",
        emotional: "INTEGER",
        conductual: "INTEGER",
        physiological: "INTEGER",
      },
      foreingKeys: [],
    },
    {
      table: "leave_motives",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        name: "TEXT NOT NULL",
        description: "TEXT NOT NULL",
      },
      foreingKeys: [],
    },
    {
      table: "persons",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        name: "TEXT NOT NULL",
      },
      foreingKeys: [],
    },
    {
      table: "places",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        name: "TEXT NOT NULL",
      },
      foreingKeys: [],
    },
    {
      table: "triggers",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        name: "TEXT NOT NULL",
      },
      foreingKeys: [],
    },
    {
      table: "cigars",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        intensity: "INTEGER",
        motive_id: "INTEGER",
        social: "INTEGER NOT NULL",
        emotional: "INTEGER NOT NULL",
        conductual: "INTEGER NOT NULL",
        physiological: "INTEGER NOT NULL",
        trigger_id: "INTEGER",
        place_id: "INTEGER NOT NULL",
        person_id: "INTEGER",
        date_time: "TEXT NOT NULL",
      },
      foreingKeys: [
        "FOREIGN KEY (motive_id) REFERENCES motives(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (trigger_id) REFERENCES triggers(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (place_id) REFERENCES places(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (person_id) REFERENCES persons(id) ON UPDATE no action ON DELETE no action",
      ],
    },
    {
      table: "cigar_persons",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        cigar_id: "INTEGER",
        person_id: "INTEGER",
        name: "TEXT NOT NULL",
      },
      foreingKeys: [
        "FOREIGN KEY (cigar_id) REFERENCES cigars(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (person_id) REFERENCES persons(id) ON UPDATE no action ON DELETE no action",
      ],
    }
  ];
}