import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import HomePage from './core/pages/home/page'
import ContainersPage from './core/pages/container/page'
import ErrorPage from './core/pages/error/page'

const getRouter = () => {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <HomePage />,
			errorElement: <ErrorPage />
		},
		{
			path: '/container',
			element: <ContainersPage />,
			errorElement: <ErrorPage />
		},
		{
			path: '/error',
			element: <ErrorPage />
		},
		{
			path: '*',
			element: <Navigate to="/error" replace />
		}
	])
	return router
}

export const AppRouter = () => {
	const routes = useMemo(() => {
		const route = getRouter()
		return route
	}, [])

	return <RouterProvider router={routes} />
}
