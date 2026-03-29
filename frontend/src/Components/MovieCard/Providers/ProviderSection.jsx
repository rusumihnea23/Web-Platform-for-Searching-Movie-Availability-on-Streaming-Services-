
export default function ProviderSection({movieTitle, title, list }) {
    if (!list || list.length === 0) return null;

    return (
        <div>
            <h4 className="text-sm uppercase tracking-wider text-amber-300 mb-2">{title}</h4>
            
            <div className="flex flex-wrap gap-3">
                {list.map((provider) => (
                    <div
                        key={provider.provider_id}
                        className="group relative"
                        title={provider.provider_name}
                    >
                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(provider.provider_name)+" "+movieTitle} `}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="w-10 h-10 rounded-lg shadow-lg border border-slate-700 group-hover:scale-110 transition-transform"

                            /> </a>
                        <h1>| <a className="text-slate-500">{provider.provider_name}</a> | </h1>
                       
                    </div>
                ))}
            </div>
        </div>
    );
}