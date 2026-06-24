import { NextResponse } from "next/server";
import { cities, states } from "estados-cidades";

const PRIORITY_UFS = ["MG", "SP", "RJ"] as const;
type PriorityUf = (typeof PRIORITY_UFS)[number];

type City = {
  id: string;
  name: string;
  uf: string;
};

const allCities: City[] = states().flatMap((uf) =>
  cities(uf).map((city) => ({
    id: `${uf}-${city}`,
    name: city,
    uf,
  })),
);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function scoreCity(city: City, query: string) {
  const cityName = normalize(city.name);
  const priorityUf = PRIORITY_UFS.indexOf(city.uf as PriorityUf);
  const ufScore = priorityUf >= 0 ? priorityUf : PRIORITY_UFS.length;
  const matchScore = cityName === query ? 0 : cityName.startsWith(query) ? 1 : 2;

  return ufScore * 10 + matchScore;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q") || "");

  if (query.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  const cities = allCities
    .filter((city) => normalize(city.name).includes(query))
    .sort((a, b) => {
      const scoreDiff = scoreCity(a, query) - scoreCity(b, query);
      if (scoreDiff !== 0) return scoreDiff;
      return a.name.localeCompare(b.name, "pt-BR");
    })
    .slice(0, 10)
    .map((city) => ({
      id: city.id,
      label: `${city.name}, ${city.uf}`,
      name: city.name,
      uf: city.uf,
    }));

  return NextResponse.json({ cities });
}
