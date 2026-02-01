package com.cdac.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // FIX: Explicitly map all React Routes so they forward to index.html
    // This fixes the "404" error when refreshing /faculty/conduct
    @RequestMapping(value = {
        "/", 
        "/login", 
        "/admin/**", 
        "/faculty/**", 
        "/student/**" 
    })
    public String redirect() {
        return "forward:/index.html";
    }
}