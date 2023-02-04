import GoogleMapReact from 'google-map-react'

const AnyReactComponent = ({ text }) => <div className='map-marker'>📍</div>

export function MapCmp({ cmp, onSelectCmp, onHoverCmp }) {
    const defaultProps = {
        center: {
            lat: cmp.content.lat,
            lng: cmp.content.lng,
        },
        zoom: cmp.content.zoom,
    }

    return (
        <div
            style={{ height: '100%', width: '100%', ...cmp.style }}
            className={`${cmp.name} no-click map`}
            onClick={e => onSelectCmp(e, cmp)}
            onMouseOver={onHoverCmp}
            onMouseOut={ev => ev.currentTarget.classList.remove('hover')}
        >
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyB5mXoA76shI6CK3DmGjZi3M4PMn7YX4WA' }}
                center={defaultProps.center}
                zoom={defaultProps.zoom}
            >
                {cmp.content.markers.map(marker => {
                    return <AnyReactComponent lat={marker.lat} lng={marker.lng} key={marker.id} />
                })}
            </GoogleMapReact>
        </div>
    )
}
