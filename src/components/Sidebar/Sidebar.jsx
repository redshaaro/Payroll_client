import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import NAVIGATION from '../../config/navigation';

const Sidebar = () => (
    <Drawer
        variant="permanent"
        sx={{
            width: 240,
            '& .MuiDrawer-paper': {
                width: 240,
                bgcolor: "#21211f", // Dark Modern Gradient
                border: "none",
            }
        }}
    >
        {/* Logo Section */}
        <Box sx={{ textAlign: "center", py: 2,  bgcolor: "#21211f"}}>
            <Typography variant="h5" sx={{ color: "#61DAFB", fontWeight: "bold" }}>
                Crystal
            </Typography>
        </Box>

        {/* Thin Grey Divider */}
        <Divider sx={{ bgcolor: "#444" }} />

        {/* Navigation Links */}
        <List sx={{ width: 240, height: "100%", padding: "10px" }}>
            {NAVIGATION.map((item) => (
                <ListItem
                    component={Link}
                    to={`/${item.segment}`}
                    key={item.title}
                    sx={{
                        color: "#dbdce5",
                        fontWeight: "bold",
                        transition: "color 0.3s",
                        "&:hover": { color: "#61DAFB" }, // React Blue on Hover
                    }}
                >
                    <ListItemIcon sx={{ color: "#dbdce5" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItem>
            ))}
        </List>
    </Drawer>
);

export default Sidebar;
