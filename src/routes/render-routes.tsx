import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { RouteConfig } from 'react-router-config'

function getRouteKey(route: RouteConfig) {
  return (route.path || '').toString()
}

function renderRoute(route: RouteConfig) {
  const { render, component, ...otherAttrs } = route
  const key = getRouteKey(route)
  function renderComp(props: any) {
    const extendedProps = { ...props, route }
    return render
      ? render(extendedProps)
      : React.createElement(component as any, extendedProps as any)
  }
  return <Route key={key} {...otherAttrs} render={(props: any) => renderComp(props)} />
}

export function renderPrivateRoute(
  route: RouteConfig,
  isAuthenticated: boolean,
) {
  return isAuthenticated ? (
    renderRoute(route)
  ) : (
    <Redirect key={getRouteKey(route)} to="/login" />
  )
}

export function renderRoutes(routes: RouteConfig[], isAuthenticated = true) {
  const routeComponents = routes.map((route) => renderPrivateRoute(route, isAuthenticated))
  return routes && routes.length ? (
    <Switch>
      {routeComponents}
      <Redirect to="/404" />
    </Switch>
  ) : null
}
