export default function migrations() {
  return [
    {
      table: "cigars",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        intensity: "INTEGER NOT NULL",
        motive_id: "INTEGER NOT NULL",
        social: "INTEGER",
        emotional: "INTEGER",
        conductual: "INTEGER",
        physiological: "INTEGER",
        trigger_id: "INTEGER NOT NULL",
        place_id: "INTEGER NOT NULL",
        person_id: "INTEGER NOT NULL",
        date_time: "TIMESTAMP DEFAULT now() NOT NULL",
      },
      foreingKeys: [
        "FOREIGN KEY (motive_id) REFERENCES motives(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (trigger_id) REFERENCES triggers(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (place_id) REFERENCES places(id) ON UPDATE no action ON DELETE no action",
        "FOREIGN KEY (person_id) REFERENCES persons(id) ON UPDATE no action ON DELETE no action",
      ],
    },
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
  ];
}
