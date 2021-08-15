import React, { useContext } from "react"
import { FilterContext } from "../App";
import './Filter.scss'

function Filter() {
    const { filters, updateFilters } = useContext(FilterContext) as any;

    function updateFilter(filter: any) {
        updateFilters({
            ...filters,
            ...filter
        })
    }

    return (
        <div className="filter">
            <h2>Filters</h2>
            <section className="filter__content">
                <div className="filter__item">
                    Grayscale
                    <input type="checkbox" defaultChecked={filters.grayscale} onChange={e => updateFilter({ grayscale: e.target.checked })} />
                </div>
                <div className="filter__item">
                    Brighten
                    <input type="range" min="0" max="255" value={filters.brighten} onChange={e => updateFilter({ brighten: Number(e.target.value) })} />
                </div>
                <div className="filter__item">
                    Threshold
                    <input type="range" min="0" max="255" value={filters.threshold} onChange={e => updateFilter({ threshold: Number(e.target.value) })} />
                </div>
                <div className="filter__item">
                    Blur
                    <input type="checkbox" defaultChecked={filters.blur} onChange={e => updateFilter({ blur: e.target.checked })} />
                </div>
                <div className="filter__item">
                    Sharpen
                    <input type="checkbox" defaultChecked={filters.sharpen} onChange={e => updateFilter({ sharpen: e.target.checked })} />
                </div>
                <div className="filter__item">
                    Sobel
                    <input type="checkbox" defaultChecked={filters.sobel} onChange={e => updateFilter({ sobel: e.target.checked })} />
                </div>
            </section>
        </div>
    )
}

export default Filter