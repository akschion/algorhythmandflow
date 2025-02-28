import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const NavigationMenu = styled.nav`
  background-color: #f0f0f0;
  padding: 10px;
`;

const NavigationMenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const NavigationMenuItem = styled.li`
  margin-right: 20px;
`;

const TopicFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Added gap for better spacing */
  margin-top: 20px;
`;

const TopicButton = styled.button`
  background-color: #e0e0e0;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px; /* Added margin for better spacing */
`;


function App() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className="font-bold text-xl no-underline mr-4 ml-4">
              Math x Tech x Hip-hop
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <TopicFilter>
        <TopicButton>Topic 1</TopicButton>
        <TopicButton>Topic 2</TopicButton>
        <TopicButton>Topic 3</TopicButton>
      </TopicFilter>
    </div>
  );
}

export default App;