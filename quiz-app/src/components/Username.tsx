import * as React from 'react'
import { UserProps } from '../Interfaces/UserProps'

export const Username: React.FC<UserProps> = (props) => {
	return (
		<>
			<h2>user: {props.userName}</h2>
			<p>{props.children}</p>
		</>
	)
}
