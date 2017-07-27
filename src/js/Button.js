import classNames from './classnames';

const Button = props => {
	const cssclasses = classNames('Button', props.className);
	return props.href
		? <a {...props} className={cssclasses} />
		: <button {...props} className={cssclasses} />;
};

Button.propTypes = {
	href: React.PropTypes.string
};

export default Button