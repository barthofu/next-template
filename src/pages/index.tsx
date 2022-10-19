import type { NextPage } from 'next'

import { Box } from '@chakra-ui/react'
import { DefaultLayout } from '@components/layouts'

const HomePage: NextPage = () => {

	return (<>

		<DefaultLayout
			title='Home'
		>

			<Box>
				Hello world from index
			</Box>

		</DefaultLayout>		
	
	</>)
}

export default HomePage