import styled from 'styled-components'

const MapContainer = styled.div`
	aspect-ratio: 2/1;
	background: url(/static/images/map.png);
	background-color: #353636;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
`
export const Map = () => <MapContainer />
