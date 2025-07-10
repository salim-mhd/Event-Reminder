"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { ColorPaletteProp, PaletteRange, useTheme } from "@mui/joy";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { GitHub, Google } from "@mui/icons-material";

import "@/styles/globals.css";
import CommonTextField from "../common/CommonTextField";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/utils/api";
import router from "next/router";
import { useDispatch } from "react-redux";
import { createUser } from "@/store/slices/authSlice";

const LoginForm = () => {
  const [color, setColor] = React.useState<ColorPaletteProp>("primary");
  const [solid, setSolid] = React.useState<boolean>(true);
  const theme = useTheme();
  const dispatch = useDispatch();

  const shade = (x: keyof PaletteRange): string => theme.vars.palette[color][x];

  const color1 = solid ? shade(800) : shade(600);
  const color2 = solid ? shade(600) : shade(200);
  const color3 = shade(900);

  const gradient1 = `${color1}, ${color2} 65%`;
  const gradient2 = `${color1} 65%, ${color3}`;

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Access Token:", tokenResponse.access_token);

      // You can now send this token to your backend
      const respons = await api.post("/google-login", {
        access_token: tokenResponse.access_token,
      });

      const { data } = respons;
      console.log('data llll', data);
      
      if (data) {
        localStorage.setItem("user", JSON.stringify({ ...data?.user, token: data?.token }));
        localStorage.setItem("token", data?.token);
        dispatch(createUser({ ...data?.user, token: data?.token }));
        router.push("/dashboard");
      }
    },
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    flow: "implicit",
  });

  return (
    <Sheet
      variant={solid ? "solid" : "soft"}
      color={color}
      invertedColors
      sx={[
        {
          flexGrow: 1,
          position: "relative",
          display: "flex",
          p: "6rem 3rem",
          borderRadius: "md",
          overflow: "clip",
          "&::after": {
            content: `""`,
            display: "block",
            width: "40rem",
            height: "60rem",
            background: `linear-gradient(to top, ${gradient1}, ${gradient2})`,
            position: "absolute",
            transform: "rotate(-45deg)",
            top: { xs: "-80%", sm: "-95%", md: "-65%", lg: "-70%" },
            right: { xs: "-70%", sm: "-15%" },
          },
        },
        solid ? { bgcolor: shade(800) } : { bgcolor: shade(100) },
      ]}
    >
      <div className="flex items-center justify-center p-4 z-9">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8">
            <Box className="text-center mb-8">
              <Typography className="font-bold text-gray-800 mb-2 fs-1">
                Welcome Back
              </Typography>
              <Typography>Sign in to your account</Typography>
            </Box>

            <form className="space-y-4">
              <CommonTextField
                label="Email"
                type="email"
                value={""}
                onChange={() => console.log("hello")}
              />

              <CommonTextField
                label="Password"
                type="number"
                value={""}
                onChange={() => console.log("hello")}
              />

              <Box className="flex justify-between items-center">
                <Link
                  href="#"
                  variant="body2"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                // disabled={isLoading}
                className="py-3 mt-6"
              >
                Sign In
              </Button>
            </form>

            <Divider className="my-5">
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Box className="flex gap-3">
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<Google />}
                onClick={() => handleLogin()}
                className="flex-1 text-red-50"
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="info"
                startIcon={<GitHub />}
                // onClick={() => handleSocialLogin('GitHub')}
                className="flex-1 bg-[black]"
              >
                GitHub
              </Button>
            </Box>

            <Box className="text-center mt-6">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>

      <Sheet
        sx={{
          width: "auto",
          height: "auto",
          zIndex: 1,
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          bgcolor: "transparent",
          display: "flex",
          gap: 2,
          "& button": { borderRadius: "50%" },
        }}
      >
        <IconButton variant="solid" onClick={() => setSolid((prev) => !prev)}>
          <InvertColorsIcon fontSize="large" />
        </IconButton>
        <IconButton
          variant="soft"
          onClick={() => {
            const colors: ColorPaletteProp[] = [
              "primary",
              "neutral",
              "danger",
              "success",
              "warning",
            ];
            const nextColorIndex = (colors.indexOf(color) + 1) % colors.length;
            setColor(colors[nextColorIndex]);
          }}
        >
          <ColorLensRoundedIcon fontSize="large" />
        </IconButton>
      </Sheet>
    </Sheet>
  );
};

export default LoginForm;
