import { useState, useEffect } from "react";
import ProviderSection from "./ProviderSection";

export default function Providers({ movieTitle, watchProviders }) {
    const countryCodes = watchProviders?.results ? Object.keys(watchProviders.results) : [];
    if (countryCodes.length === 0) {
        return <p className="text-slate-400">Not available for streaming globally.</p>;
    }
    const [country, setCountry] = useState(() => {
        return countryCodes.includes("RO") ? "RO" : countryCodes[0];
    });
    const selectedCountryData = watchProviders?.results?.[country];

    return (
        <div className="space-y-6">
            <div>
                <h3>Available to watch on: </h3>
                <div className="flex items-center gap-2 mb-4">
                    <label className="text-sm font-bold text-slate-400">REGION:</label>
                    <select
                        className="bg-slate-900 text-white border border-slate-700 rounded p-1"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {countryCodes.map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 5. Conditional rendering for the specific selected country */}
                {selectedCountryData && (selectedCountryData.flatrate || selectedCountryData.rent || selectedCountryData.buy) ? (
                    <div className="space-y-4">
                        <ProviderSection movieTitle={movieTitle} title="Stream" list={selectedCountryData.flatrate} />
                        <ProviderSection movieTitle={movieTitle} title="Rent" list={selectedCountryData.rent} />
                        <ProviderSection movieTitle={movieTitle} title="Buy" list={selectedCountryData.buy} />
                    </div>
                ) : (
                    <p className="text-slate-400">Not available for streaming in this region.</p>
                )}
            </div>
        </div>
    );
}