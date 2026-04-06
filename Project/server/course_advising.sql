-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 06, 2026 at 05:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `course_advising`
--

-- --------------------------------------------------------

--
-- Table structure for table `advising_courses`
--

CREATE TABLE `advising_courses` (
  `id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL,
  `level` varchar(50) DEFAULT NULL,
  `course_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `advising_courses`
--

INSERT INTO `advising_courses` (`id`, `record_id`, `level`, `course_name`) VALUES
(8, 1, '300', 'CS301'),
(9, 2, '300', 'CS301');

-- --------------------------------------------------------

--
-- Table structure for table `advising_records`
--

CREATE TABLE `advising_records` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_term` varchar(50) DEFAULT NULL,
  `last_gpa` decimal(3,2) DEFAULT NULL,
  `current_term` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `advising_records`
--

INSERT INTO `advising_records` (`id`, `user_id`, `last_term`, `last_gpa`, `current_term`, `status`, `created_at`) VALUES
(1, 13, 'Fall 2025', 3.70, 'Spring 2026', 'Pending', '2026-03-31 17:22:06'),
(2, 13, 'Spring 2026', 3.50, 'Fall 2026', 'Pending', '2026-04-06 03:17:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `u_id` int(11) NOT NULL,
  `u_first_name` varchar(50) NOT NULL,
  `u_last_name` varchar(50) NOT NULL,
  `u_email` varchar(50) NOT NULL,
  `u_password` varchar(150) NOT NULL,
  `u_is_verified` int(11) NOT NULL,
  `u_is_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`u_id`, `u_first_name`, `u_last_name`, `u_email`, `u_password`, `u_is_verified`, `u_is_admin`) VALUES
(11, 'Ben', 'Dutton', 'bendutton9@gmail.com', '$2b$10$DpR6m42EWymKT7b9949j.eryKzT861F0UWt2aiP8TF4yIxUr9HhaW', 1, 1),
(13, 'Benjamin', 'Dutton', 'bdutt001@odu.edu', '$2b$10$JdFHa1oXISXwo99bWXrzwu8bDOAwh8cQ985zu6tyg9ARRYcpzyo8K', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advising_courses`
--
ALTER TABLE `advising_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_record` (`record_id`);

--
-- Indexes for table `advising_records`
--
ALTER TABLE `advising_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advising_courses`
--
ALTER TABLE `advising_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `advising_records`
--
ALTER TABLE `advising_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advising_courses`
--
ALTER TABLE `advising_courses`
  ADD CONSTRAINT `fk_record` FOREIGN KEY (`record_id`) REFERENCES `advising_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `advising_records`
--
ALTER TABLE `advising_records`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`u_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
