import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./CSS/Dropdown.css";
import "./CSS/NavBarStyles.css";

const Dropdown = () => {
    const [open, setOpen] = useState(false);

    const handleMouseIn = () => setOpen(true);
    const handleMouseOut = () => setOpen(false);
    const handleClick =() => setOpen(false);

    const options = [
        { name: 'Create Poll', path: '/new-poll'},
        { name: 'Poll List', path: '/poll-list'},
        { name: 'Published Polls', path: '/'},
        { name: 'Drafted Polls', path: '/drafts'},
    ];

    return (
        <div className="dropdown" onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}>
            <button className="dropdown-toggle">
                Polls
            </button>
            {open && (
                <ul className="dropdown-menu">
                    {options.map(({ name, path }) => (
                        <li key={path}
                        className="dropdown-item"
                        >
                            <Link to={path} className="nav-link" onClick={handleClick}>
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown;
