import { render } from '@testing-library/react'

import { Card } from './card'

test('Show schema details dialog', async () => {
	const utils = render(<Card>Card Content</Card>)
	const cards = utils.container.getElementsByClassName('vui-card')

	expect(cards.length).toBe(1)
	expect(utils.getByText('Card Content')).toBeInTheDocument()
})
