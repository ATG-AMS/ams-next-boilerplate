import { faker } from "@faker-js/faker";

export type Person = {
  name: string;
  email: string;
  age?: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person["status"]>([
      "relationship",
      "complicated",
      "single",
    ])[0]!,
  };
};

export function makeData(lens: number) {
  const makeDataLevel = (depth = 0): Person[] => {
    return range(lens).map((d): Person => {
      return {
        ...newPerson(),
      };
    });
  };

  return makeDataLevel();
}
