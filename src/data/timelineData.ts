export interface TimelineEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
}

export interface TimelineLayerData {
  name: string;
  color: string;
  events: TimelineEvent[];
}

export const timelineData: Record<string, TimelineLayerData> = {
  politics: {
    name: "Politics",
    color: "hsl(210, 50%, 50%)",
    events: [
      {
        title: "World War I",
        description: "The Great War, a global conflict centered in Europe involving most of the world's great powers.",
        start: new Date("1914-07-28T00:00:00"),
        end: new Date("1918-11-11T11:00:00"),
      },
      {
        title: "Russian Revolution",
        description: "A series of revolutions that dismantled the Tsarist autocracy and led to the rise of the Soviet Union.",
        start: new Date("1917-03-08T00:00:00"),
        end: new Date("1923-12-30T00:00:00"),
      },
      {
        title: "World War II",
        description: "A global war involving most of the world's nations, the deadliest conflict in human history.",
        start: new Date("1939-09-01T04:45:00"),
        end: new Date("1945-09-02T09:00:00"),
      },
      {
        title: "Cold War",
        description: "A period of geopolitical tension between the Soviet Union and the United States and their respective allies.",
        start: new Date("1947-03-12T00:00:00"),
        end: new Date("1991-12-26T00:00:00"),
      },
      {
        title: "Fall of Berlin Wall",
        description: "The barrier that divided Berlin from 1961 to 1989 came down, symbolizing the end of the Cold War.",
        start: new Date("1989-11-09T18:53:00"),
        end: new Date("1991-12-26T00:00:00"),
      },
      {
        title: "9/11 Attacks",
        description: "Terrorist attacks on the United States that reshaped global politics and security policies.",
        start: new Date("2001-09-11T08:46:00"),
        end: new Date("2003-05-01T00:00:00"),
      },
      {
        title: "Arab Spring",
        description: "Pro-democracy uprisings that swept through the Arab world, toppling several governments.",
        start: new Date("2010-12-17T00:00:00"),
        end: new Date("2013-12-31T00:00:00"),
      },
    ],
  },
  science: {
    name: "Science",
    color: "hsl(140, 50%, 50%)",
    events: [
      {
        title: "Theory of Relativity",
        description: "Einstein published his theory of special relativity, revolutionizing physics.",
        start: new Date("1905-06-30T00:00:00"),
        end: new Date("1916-03-20T00:00:00"),
      },
      {
        title: "Discovery of Penicillin",
        description: "Alexander Fleming discovered the first antibiotic, transforming modern medicine.",
        start: new Date("1928-09-28T09:00:00"),
        end: new Date("1929-09-28T00:00:00"),
      },
      {
        title: "Manhattan Project",
        description: "Research and development undertaking during World War II that produced the first nuclear weapons.",
        start: new Date("1942-08-13T00:00:00"),
        end: new Date("1946-12-31T00:00:00"),
      },
      {
        title: "DNA Structure Discovered",
        description: "Watson and Crick revealed the double helix structure of DNA.",
        start: new Date("1953-02-28T00:00:00"),
        end: new Date("1954-04-25T00:00:00"),
      },
      {
        title: "Moon Landing",
        description: "Apollo 11 mission successfully landed humans on the Moon for the first time.",
        start: new Date("1969-07-16T13:32:00"),
        end: new Date("1969-07-24T16:50:00"),
      },
      {
        title: "Human Genome Project",
        description: "International research project mapping all human genes.",
        start: new Date("1990-10-01T00:00:00"),
        end: new Date("2003-04-14T00:00:00"),
      },
      {
        title: "Higgs Boson Discovery",
        description: "CERN announced the discovery of the Higgs boson particle.",
        start: new Date("2012-07-04T09:00:00"),
        end: new Date("2013-10-08T00:00:00"),
      },
      {
        title: "CRISPR Gene Editing",
        description: "Revolutionary gene-editing technology enabling precise DNA modifications.",
        start: new Date("2012-08-17T00:00:00"),
        end: new Date("2020-12-31T00:00:00"),
      },
    ],
  },
  culture: {
    name: "Culture",
    color: "hsl(280, 50%, 50%)",
    events: [
      {
        title: "Jazz Age",
        description: "Period of cultural dynamism in the United States, characterized by jazz music and social change.",
        start: new Date("1920-01-01T00:00:00"),
        end: new Date("1929-10-29T00:00:00"),
      },
      {
        title: "Golden Age of Hollywood",
        description: "Period of great artistic and commercial success in American cinema.",
        start: new Date("1930-01-01T00:00:00"),
        end: new Date("1960-12-31T00:00:00"),
      },
      {
        title: "Rock and Roll Era",
        description: "Birth and rise of rock and roll music, revolutionizing popular culture.",
        start: new Date("1950-01-01T00:00:00"),
        end: new Date("1960-12-31T00:00:00"),
      },
      {
        title: "British Invasion",
        description: "British bands like The Beatles dominated American pop culture.",
        start: new Date("1964-02-07T00:00:00"),
        end: new Date("1966-12-31T00:00:00"),
      },
      {
        title: "Disco Era",
        description: "Dance music and culture dominated nightclubs and popular music.",
        start: new Date("1970-01-01T00:00:00"),
        end: new Date("1979-12-31T00:00:00"),
      },
      {
        title: "Hip Hop Golden Age",
        description: "Period of innovation and influence in hip hop music and culture.",
        start: new Date("1985-01-01T00:00:00"),
        end: new Date("1995-12-31T00:00:00"),
      },
      {
        title: "Digital Streaming Era",
        description: "Music consumption shifted from physical media to streaming platforms.",
        start: new Date("2008-10-01T00:00:00"),
        end: new Date("2025-12-31T00:00:00"),
      },
    ],
  },
  technology: {
    name: "Technology",
    color: "hsl(30, 70%, 50%)",
    events: [
      {
        title: "Television Invented",
        description: "First practical television systems developed, transforming communication and entertainment.",
        start: new Date("1927-09-07T00:00:00"),
        end: new Date("1930-12-31T00:00:00"),
      },
      {
        title: "First Computer",
        description: "ENIAC, the first general-purpose electronic digital computer, was completed.",
        start: new Date("1945-02-14T00:00:00"),
        end: new Date("1946-07-29T00:00:00"),
      },
      {
        title: "Transistor Invention",
        description: "The transistor was invented, enabling modern electronics.",
        start: new Date("1947-12-16T00:00:00"),
        end: new Date("1948-06-30T00:00:00"),
      },
      {
        title: "Space Age Begins",
        description: "Sputnik 1 launched, marking the start of space exploration.",
        start: new Date("1957-10-04T19:28:00"),
        end: new Date("1958-01-04T00:00:00"),
      },
      {
        title: "Internet Development",
        description: "ARPANET, the precursor to the Internet, was developed.",
        start: new Date("1969-10-29T22:30:00"),
        end: new Date("1983-01-01T00:00:00"),
      },
      {
        title: "Personal Computer Revolution",
        description: "Personal computers became accessible to consumers, led by Apple and IBM.",
        start: new Date("1977-04-01T00:00:00"),
        end: new Date("1985-12-31T00:00:00"),
      },
      {
        title: "World Wide Web",
        description: "Tim Berners-Lee invented the World Wide Web, revolutionizing information access.",
        start: new Date("1989-03-12T00:00:00"),
        end: new Date("1993-04-30T00:00:00"),
      },
      {
        title: "Smartphone Era",
        description: "iPhone launch sparked the smartphone revolution, changing how we communicate and access information.",
        start: new Date("2007-06-29T18:00:00"),
        end: new Date("2025-12-31T00:00:00"),
      },
      {
        title: "AI Revolution",
        description: "Artificial intelligence and machine learning transform industries and society.",
        start: new Date("2015-11-30T00:00:00"),
        end: new Date("2025-12-31T00:00:00"),
      },
    ],
  },
};