import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MessageSquare,
  Star,
  Search,
  Download,
  Eye,
  User,
  Trash2
} from "lucide-react";
import { downloadCSV, downloadExcel } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useSupabaseExtended";
import { supabase } from "@/integrations/supabase/client";

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const { feedback, loading, updateFeedback } = useFeedback();

  // Filter out contact messages - those are shown in Messages tab
  const actualFeedback = useMemo(() => {
    return feedback.filter(item => item.category !== 'contact');
  }, [feedback]);

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return "text-success";
    if (rating >= 4) return "text-dental-mint";
    if (rating >= 3) return "text-warning";
    return "text-destructive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": 
        return "bg-dental-blue text-white";
      case "reviewed": 
        return "bg-success text-white";
      default: 
        return "bg-dental-gray text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFeedbacks = useMemo(() => {
    return actualFeedback.filter(feedbackItem => {
      const matchesSearch = searchTerm === "" || 
        feedbackItem.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedbackItem.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedbackItem.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating === "all" || feedbackItem.rating.toString() === filterRating;
      const matchesStatus = filterStatus === "all" || feedbackItem.status === filterStatus;
      const matchesCategory = filterCategory === "all" || feedbackItem.category === filterCategory;
      
      return matchesSearch && matchesRating && matchesStatus && matchesCategory;
    });
  }, [actualFeedback, searchTerm, filterRating, filterStatus, filterCategory]);

  const averageRating = useMemo(() => {
    const total = filteredFeedbacks.reduce((sum, feedbackItem) => sum + feedbackItem.rating, 0);
    return filteredFeedbacks.length > 0 ? (total / filteredFeedbacks.length).toFixed(1) : "0.0";
  }, [filteredFeedbacks]);

  const handleViewFeedback = (feedbackId: string) => {
    const feedbackItem = actualFeedback.find(f => f.id === feedbackId);
    if (feedbackItem) {
      toast({
        title: `Feedback from ${feedbackItem.patient_name}`,
        description: feedbackItem.message.length > 100 ? feedbackItem.message.substring(0, 100) + "..." : feedbackItem.message,
      });
    }
  };

  const handleMarkAsReviewed = async (feedbackId: string) => {
    try {
      await updateFeedback(feedbackId, { status: 'reviewed' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (window.confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('feedback')
          .delete()
          .eq('id', feedbackId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Feedback deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete feedback",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportFeedbacks = (format: 'csv' | 'excel') => {
    const exportData = filteredFeedbacks.map(feedbackItem => ({
      'Patient Name': feedbackItem.patient_name,
      Email: feedbackItem.patient_email,
      Rating: feedbackItem.rating,
      Message: feedbackItem.message,
      Category: feedbackItem.category,
      'Date': formatDate(feedbackItem.created_at),
      Status: feedbackItem.status
    }));

    if (format === 'csv') {
      downloadCSV(exportData, 'feedback-export');
    } else {
      downloadExcel(exportData, 'feedback-export');
    }
    
    toast({
      title: "Feedbacks Exported",
      description: `Feedback data has been exported as ${format.toUpperCase()} successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-dental-blue">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Patient Feedback & Reviews</h2>
          <p className="text-dental-gray text-xs sm:text-sm md:text-base">Monitor patient feedback and service reviews in real-time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="dental-outline" size="sm" onClick={() => handleExportFeedbacks('csv')} className="w-full sm:w-auto text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Export </span>CSV
          </Button>
          <Button variant="dental-outline" size="sm" onClick={() => handleExportFeedbacks('excel')} className="w-full sm:w-auto text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Export </span>Excel
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="search" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 border-dental-blue-light focus:border-dental-blue text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="filterCategory" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Category
              </Label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-background h-8 sm:h-10"
              >
                <option value="all">All Types</option>
                <option value="general">General Feedback</option>
                <option value="service">Service Review</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filterRating" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Rating
              </Label>
              <select
                id="filterRating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-background h-8 sm:h-10"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filterStatus" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Status
              </Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-background h-8 sm:h-10"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-dental-blue">{actualFeedback.length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning fill-current" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning">{averageRating}</p>
              </div>
              <p className="text-dental-gray text-xs sm:text-sm">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-dental-blue">{actualFeedback.filter(f => f.status === 'new').length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">New</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-success">{filteredFeedbacks.length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">Filtered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card className="border-dental-blue-light">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-dental-blue text-base sm:text-lg md:text-xl">Patient Feedback & Reviews</CardTitle>
          <CardDescription className="text-xs sm:text-sm">All patient feedback and service reviews with real-time updates</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          {filteredFeedbacks.length > 0 ? (
            <div className="rounded-lg border border-dental-blue-light overflow-hidden">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader className="bg-dental-blue-light hidden sm:table-header-group">
                      <TableRow>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Patient</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Rating</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">Message</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4 hidden lg:table-cell">Date</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeedbacks.map((feedbackItem) => (
                        <TableRow key={feedbackItem.id} className="hover:bg-dental-blue-light/50 border-b sm:table-row flex flex-col sm:border-b-0 py-3 sm:py-0">
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-dental-blue flex-shrink-0" />
                                <span className="font-medium text-foreground text-xs sm:text-sm break-words">{feedbackItem.patient_name}</span>
                              </div>
                              <div className="text-xs text-dental-gray break-all">{feedbackItem.patient_email}</div>
                              <div className="sm:hidden mt-1">
                                <p className="text-xs text-dental-gray line-clamp-2">{feedbackItem.message}</p>
                                <Badge variant="outline" className="mt-1 text-[10px]">{feedbackItem.category}</Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <div className="flex items-center space-x-1">
                              <span className={`font-bold text-sm sm:text-base ${getRatingColor(feedbackItem.rating)}`}>{feedbackItem.rating}</span>
                              <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${getRatingColor(feedbackItem.rating)} fill-current`} />
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-4">
                            <div className="max-w-xs">
                              <p className="text-xs sm:text-sm text-dental-gray truncate">{feedbackItem.message}</p>
                              <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">{feedbackItem.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-4">
                            <div className="text-xs sm:text-sm text-dental-gray whitespace-nowrap">{formatDate(feedbackItem.created_at)}</div>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <Badge className={`${getStatusColor(feedbackItem.status)} text-[10px] sm:text-xs`}>
                              {feedbackItem.status.charAt(0).toUpperCase() + feedbackItem.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-dental-blue hover:bg-dental-blue-light h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => handleViewFeedback(feedbackItem.id)}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              {feedbackItem.status === 'new' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-success hover:bg-success/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  onClick={() => handleMarkAsReviewed(feedbackItem.id)}
                                >
                                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => handleDeleteFeedback(feedbackItem.id)}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-dental-gray mx-auto mb-3 sm:mb-4" />
              <p className="text-dental-gray text-xs sm:text-sm">No feedback found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManagement;