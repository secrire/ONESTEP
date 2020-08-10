import React from "react"; 
import AddStepPic from "./addStepPic"; 
import renderer from 'react-test-renderer'; 

it("react render", () => { 
    const component = renderer.create( 
        <AddStepPic/>); 
        let tree = component.toJSON(); 
        expect(tree).toMatchSnapshot(); 
    });
