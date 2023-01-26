import styled from 'styled-components'

const W = styled.div`
	background-color: #e10707;
	color: white;
	text-shadow: 1px 1px 2px #00000033, -1px 1px 2px #00000033,
		-1px -1px 2px #00000033, 1px -1px 2px #00000033;
	padding: 0.5rem;
	text-align: center;
	font-weight: bold;
`

export const Warning = ({ title }: { title: string }) => (
	<W role="alert">{title}</W>
)
