import CitySearchBox from "./components/CitySearchBox";

export default function App() {
  return (
    <main className="page">
      <div className="map-grid" aria-hidden="true" />
      <section className="hero" aria-labelledby="page-title">
        <h1 id="page-title">City AutoCompleter</h1>
        <CitySearchBox />
      </section>
    </main>
  );
}
