import { Card as CardComponent, CardProps, MouseEventHandler } from 'vui'

type Props = CardProps & {
	children?: React.ReactNode
	onClick?: MouseEventHandler<HTMLDivElement>
	onMouseOut?: MouseEventHandler<HTMLDivElement>
	onMouseOver?: MouseEventHandler<HTMLDivElement>
}

export const Card = ({ children, onClick, ...rest }: Props) => (
	<CardComponent column h="200px" isInteractive={!!onClick} onClick={onClick} p="20px" w="328px" {...rest}>
		{children}
	</CardComponent>
)
